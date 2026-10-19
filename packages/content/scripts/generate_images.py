#!/usr/bin/env python3
"""
为每道菜谱生成原创示意图（成品图 + 逐步图）。

重要说明：
- 这些图片是脚本绘制的「示意图」，不是实拍照片，界面与文档中必须明确标注；
- 每道菜的成品图、每个步骤图都是独立绘制（步骤编号与标题不同），不复用封面图；
- 生成规则由菜系配色 + 菜名/步骤标题决定，输出到 packages/content/images/recipes/。

用法：
    python packages/content/scripts/generate_images.py            # 全量生成
    python packages/content/scripts/generate_images.py --only id  # 只生成某道菜
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import random
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[3]
CONTENT = ROOT / "packages" / "content"
RECIPE_DIR = CONTENT / "data" / "recipes"
OUTPUT_DIR = CONTENT / "images" / "recipes"

COVER_SIZE = (1200, 800)
STEP_SIZE = (1000, 667)
SCALE = 2  # 先放大绘制再缩放，获得平滑边缘

CUISINE_PALETTES = {
    "家常菜": ("#C95B45", "#E89A4F", "#F6DFC4", "#F3B65C"),
    "川湘": ("#B93A2E", "#E2653B", "#F8DEC8", "#E9A33F"),
    "粤式": ("#4C8464", "#9BC7A4", "#F1EEE0", "#D9C083"),
    "江浙": ("#8A5A3B", "#CFA164", "#F6E8D0", "#B97C4B"),
    "北方": ("#96673D", "#D8B06B", "#F7EBD4", "#A9C08A"),
    "西式": ("#6E8B4E", "#C9CE9A", "#F7F1E2", "#D98F5A"),
    "日韩": ("#A8444F", "#E3A09A", "#F8EDE2", "#E9C46A"),
    "轻食": ("#7FA650", "#C6DBA4", "#F8F3E6", "#F0B95B"),
}

DISH_EMOJI_HINT = {
    "粥": "porridge",
    "汤": "soup",
    "面": "noodle",
    "饭": "rice",
    "饺": "dumpling",
    "三明治": "sandwich",
    "酸奶": "yogurt",
    "沙拉": "salad",
}

FONT_CANDIDATES = [
    r"C:\Windows\Fonts\msyh.ttc",
    r"C:\Windows\Fonts\msyhbd.ttc",
    r"C:\Windows\Fonts\simhei.ttf",
    r"/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
]
BOLD_FONT_CANDIDATES = [
    r"C:\Windows\Fonts\msyhbd.ttc",
    r"C:\Windows\Fonts\msyh.ttc",
    r"C:\Windows\Fonts\simhei.ttf",
    r"/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc",
]


def find_font(candidates: list[str]) -> str:
    for candidate in candidates:
        if Path(candidate).exists():
            return candidate
    raise RuntimeError("找不到可用的中文字体，请安装微软雅黑或 Noto Sans CJK")


FONT_REGULAR = find_font(FONT_CANDIDATES)
FONT_BOLD = find_font(BOLD_FONT_CANDIDATES)

_font_cache: dict[tuple[str, int], ImageFont.FreeTypeFont] = {}


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    path = FONT_BOLD if bold else FONT_REGULAR
    key = (path, size)
    if key not in _font_cache:
        _font_cache[key] = ImageFont.truetype(path, size)
    return _font_cache[key]


def hex_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]


def mix(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return (
        round(a[0] + (b[0] - a[0]) * t),
        round(a[1] + (b[1] - a[1]) * t),
        round(a[2] + (b[2] - a[2]) * t),
    )


def lighten(color: tuple[int, int, int], amount: float) -> tuple[int, int, int]:
    return mix(color, (255, 255, 255), amount)


def darken(color: tuple[int, int, int], amount: float) -> tuple[int, int, int]:
    return mix(color, (24, 20, 16), amount)


def with_alpha(color: tuple[int, int, int], alpha: int) -> tuple[int, int, int, int]:
    return (color[0], color[1], color[2], alpha)


def rng_for(key: str) -> random.Random:
    digest = hashlib.sha256(key.encode("utf-8")).hexdigest()
    return random.Random(int(digest[:16], 16))


def vertical_gradient(size: tuple[int, int], top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    width, height = size
    gradient = Image.new("RGB", (1, height))
    pixels = gradient.load()
    for y in range(height):
        pixels[0, y] = mix(top, bottom, y / max(1, height - 1))
    return gradient.resize((width, height), Image.Resampling.BILINEAR)


def radial_glow(size: tuple[int, int], center: tuple[int, int], radius: int, color: tuple[int, int, int], alpha: int) -> Image.Image:
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    steps = 26
    for index in range(steps, 0, -1):
        ratio = index / steps
        current = int(radius * ratio)
        current_alpha = int(alpha * (1 - ratio) ** 2)
        draw.ellipse(
            [center[0] - current, center[1] - current, center[0] + current, center[1] + current],
            fill=with_alpha(color, current_alpha),
        )
    return layer.filter(ImageFilter.GaussianBlur(radius * 0.12))


def draw_background(size: tuple[int, int], cuisine: str) -> Image.Image:
    warm_top = hex_rgb("#FFFBF3")
    warm_bottom = hex_rgb("#F1E4D1")
    background = vertical_gradient(size, warm_top, warm_bottom).convert("RGBA")
    background.alpha_composite(
        radial_glow(size, (int(size[0] * 0.24), int(size[1] * 0.18)), int(size[0] * 0.42), hex_rgb("#FFF1D6"), 120)
    )
    background.alpha_composite(
        radial_glow(size, (int(size[0] * 0.82), int(size[1] * 0.26)), int(size[0] * 0.34), hex_rgb(CUISINE_PALETTES[cuisine][2]), 90)
    )
    return background


def draw_table(image: Image.Image, top_ratio: float = 0.62) -> None:
    width, height = image.size
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    table_top = int(height * top_ratio)
    draw.rectangle([0, table_top, width, height], fill=with_alpha(hex_rgb("#E7D2B4"), 210))
    for index in range(9):
        y = table_top + int((height - table_top) * index / 9)
        draw.line([(0, y), (width, y + 3)], fill=with_alpha(hex_rgb("#D8BE9C"), 90), width=2)
    image.alpha_composite(overlay)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font_obj: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    lines: list[str] = []
    current = ""
    for char in text:
        candidate = current + char
        if draw.textlength(candidate, font=font_obj) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = char
    if current:
        lines.append(current)
    return lines


def draw_steam(image: Image.Image, origin: tuple[int, int], scale: float) -> None:
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    x, y = origin
    for index, offset in enumerate((-1, 0, 1)):
        start_x = x + offset * int(38 * scale)
        points = []
        for step in range(18):
            t = step / 17
            points.append(
                (
                    start_x + math.sin(t * math.pi * 1.6 + index) * 12 * scale,
                    y - t * 120 * scale,
                )
            )
        draw.line(points, fill=with_alpha((255, 255, 255), 150), width=max(2, int(4 * scale)), joint="curve")
    image.alpha_composite(overlay.filter(ImageFilter.GaussianBlur(1.2)))


def draw_chopsticks(image: Image.Image, x: int, y: int, length: int, angle: float) -> None:
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for offset in (0, 18):
        dx = math.cos(angle) * length
        dy = math.sin(angle) * length
        draw.line(
            [(x, y + offset), (x + dx, y + dy + offset)],
            fill=with_alpha(hex_rgb("#8A5A3B"), 220),
            width=6,
        )
    image.alpha_composite(overlay)


def dish_kind(recipe: dict) -> str:
    name = recipe["name"]
    for keyword, kind in DISH_EMOJI_HINT.items():
        if keyword in name:
            return kind
    return "stirfry"


def vessel_for(kind: str) -> str:
    if kind in ("porridge", "soup", "yogurt", "noodle"):
        return "bowl"
    if kind == "sandwich":
        return "board"
    return "plate"


def draw_vessel(image: Image.Image, center: tuple[int, int], radius: int, vessel: str, palette: tuple[str, ...]) -> None:
    cx, cy = center
    shadow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.ellipse(
        [cx - radius * 1.02, cy - radius * 0.52 + 26, cx + radius * 1.02, cy + radius * 0.62 + 26],
        fill=(60, 42, 26, 60),
    )
    image.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(22)))

    if vessel == "bowl":
        draw = ImageDraw.Draw(image)
        draw.ellipse([cx - radius, cy - radius * 0.62, cx + radius, cy + radius * 0.66], fill=hex_rgb("#FDFAF4"))
        draw.ellipse(
            [cx - radius * 0.9, cy - radius * 0.5, cx + radius * 0.9, cy + radius * 0.5],
            fill=hex_rgb(palette[2]),
        )
        draw.arc(
            [cx - radius * 1.06, cy - radius * 1.1, cx + radius * 1.06, cy + radius * 0.72],
            start=10,
            end=170,
            fill=lighten(hex_rgb(palette[3]), 0.35),
            width=10,
        )
    elif vessel == "board":
        draw = ImageDraw.Draw(image)
        draw.rounded_rectangle(
            [cx - radius, cy - radius * 0.66, cx + radius, cy + radius * 0.7],
            radius=int(radius * 0.16),
            fill=hex_rgb("#D9B382"),
            outline=darken(hex_rgb("#D9B382"), 0.12),
            width=3,
        )
        for index in range(4):
            y = cy - radius * 0.4 + index * radius * 0.3
            draw.line([(cx - radius * 0.8, y), (cx + radius * 0.8, y)], fill=with_alpha(hex_rgb("#C39B68"), 120), width=2)
    else:
        draw = ImageDraw.Draw(image)
        draw.ellipse([cx - radius, cy - radius * 0.72, cx + radius, cy + radius * 0.72], fill=hex_rgb("#FDFAF4"))
        draw.ellipse(
            [cx - radius * 0.8, cy - radius * 0.56, cx + radius * 0.8, cy + radius * 0.56],
            fill=hex_rgb(palette[2]),
        )
        draw.arc(
            [cx - radius * 0.96, cy - radius * 0.7, cx + radius * 0.96, cy + radius * 0.7],
            start=200,
            end=340,
            fill=lighten(hex_rgb(palette[3]), 0.25),
            width=8,
        )


def draw_food(image: Image.Image, center: tuple[int, int], radius: int, kind: str, palette: tuple[str, str, str, str], rand: random.Random) -> None:
    draw = ImageDraw.Draw(image)
    cx, cy = center
    primary = hex_rgb(palette[0])
    secondary = hex_rgb(palette[1])
    accent = hex_rgb(palette[3])

    if kind in ("porridge", "soup"):
        surface = mix(secondary, (255, 255, 255), 0.42)
        draw.ellipse(
            [cx - radius * 0.78, cy - radius * 0.44, cx + radius * 0.78, cy + radius * 0.42],
            fill=surface,
        )
        for _ in range(14):
            angle = rand.random() * math.tau
            distance = rand.random() ** 0.6 * radius * 0.58
            dot_x = cx + math.cos(angle) * distance
            dot_y = cy + math.sin(angle) * distance * 0.6
            dot_radius = rand.uniform(6, 16)
            dot_color = mix(primary if rand.random() < 0.5 else accent, surface, rand.uniform(0.05, 0.35))
            draw.ellipse(
                [dot_x - dot_radius, dot_y - dot_radius * 0.6, dot_x + dot_radius, dot_y + dot_radius * 0.6],
                fill=with_alpha(dot_color, 235),
            )
        draw_steam(image, (cx, cy - int(radius * 0.5)), 1.0)
        return

    if kind == "noodle":
        for index in range(9):
            offset = (index - 4) * radius * 0.12
            points = []
            for step in range(26):
                t = step / 25
                points.append(
                    (
                        cx - radius * 0.58 + t * radius * 1.16,
                        cy + offset + math.sin(t * math.pi * 3 + index) * radius * 0.08,
                    )
                )
            draw.line(points, fill=mix(accent, (255, 248, 220), 0.3), width=9)
        draw.ellipse([cx - radius * 0.52, cy - radius * 0.44, cx - radius * 0.2, cy - radius * 0.12], fill=secondary)
        draw_steam(image, (cx, cy - int(radius * 0.55)), 0.9)
        return

    if kind == "rice":
        draw.ellipse(
            [cx - radius * 0.55, cy - radius * 0.42, cx + radius * 0.55, cy + radius * 0.38],
            fill=mix((255, 252, 240), secondary, 0.18),
        )
        for _ in range(60):
            angle = rand.random() * math.tau
            distance = rand.random() ** 0.5 * radius * 0.5
            dot_x = cx + math.cos(angle) * distance
            dot_y = cy + math.sin(angle) * distance * 0.62
            draw.ellipse([dot_x, dot_y, dot_x + 4, dot_y + 3], fill=(255, 255, 255, 200))
        for _ in range(7):
            blob_x = cx + rand.uniform(-0.42, 0.42) * radius
            blob_y = cy + rand.uniform(-0.28, 0.3) * radius
            blob_w = rand.uniform(0.12, 0.2) * radius
            draw.ellipse(
                [blob_x - blob_w, blob_y - blob_w * 0.7, blob_x + blob_w, blob_y + blob_w * 0.7],
                fill=with_alpha(primary, 230),
            )
        return

    if kind == "dumpling":
        for index in range(7):
            angle = (index / 7) * math.tau + 0.2
            dist = radius * (0.3 if index % 2 == 0 else 0.5)
            dx = cx + math.cos(angle) * dist
            dy = cy + math.sin(angle) * dist * 0.62
            width = radius * 0.2
            draw.ellipse([dx - width, dy - width * 0.55, dx + width, dy + width * 0.55], fill=mix((255, 249, 232), secondary, 0.18))
            draw.arc([dx - width, dy - width * 0.8, dx + width, dy + width * 0.3], start=200, end=340, fill=mix(secondary, primary, 0.4), width=7)
        return

    if kind == "sandwich":
        for index in range(2):
            base_x = cx - radius * 0.42 + index * radius * 0.5
            base_y = cy + radius * 0.24
            draw.polygon(
                [
                    (base_x - radius * 0.24, base_y),
                    (base_x + radius * 0.2, base_y - radius * 0.52),
                    (base_x + radius * 0.34, base_y - radius * 0.46),
                    (base_x - radius * 0.1, base_y + radius * 0.06),
                ],
                fill=mix(hex_rgb("#E9C27C"), (255, 255, 255), 0.12),
            )
            draw.line(
                [(base_x - radius * 0.12, base_y - radius * 0.03), (base_x + radius * 0.26, base_y - radius * 0.42)],
                fill=primary,
                width=10,
            )
            draw.line(
                [(base_x - radius * 0.17, base_y - radius * 0.1), (base_x + radius * 0.2, base_y - radius * 0.49)],
                fill=mix(hex_rgb("#8CB369"), (255, 255, 255), 0.2),
                width=8,
            )
        return

    if kind == "yogurt":
        draw.ellipse(
            [cx - radius * 0.68, cy - radius * 0.4, cx + radius * 0.68, cy + radius * 0.38],
            fill=mix((255, 255, 255), secondary, 0.16),
        )
        for index in range(9):
            angle = (index / 9) * math.tau
            dist = radius * rand.uniform(0.16, 0.46)
            dot_x = cx + math.cos(angle) * dist
            dot_y = cy + math.sin(angle) * dist * 0.6
            size = radius * rand.uniform(0.07, 0.13)
            color = [primary, secondary, accent, hex_rgb("#8CB369")][index % 4]
            draw.ellipse([dot_x - size, dot_y - size, dot_x + size, dot_y + size], fill=mix(color, (255, 255, 255), 0.1))
        return

    # stirfry / 默认：多个不规则的食材块
    blob_count = 11
    for index in range(blob_count):
        angle = (index / blob_count) * math.tau + rand.uniform(-0.16, 0.16)
        dist = radius * rand.uniform(0.16, 0.54)
        blob_x = cx + math.cos(angle) * dist
        blob_y = cy + math.sin(angle) * dist * 0.6
        width = radius * rand.uniform(0.11, 0.2)
        height = width * rand.uniform(0.62, 0.86)
        color = mix(primary if index % 3 else secondary, accent, rand.uniform(0.0, 0.45))
        draw.rounded_rectangle(
            [blob_x - width, blob_y - height, blob_x + width, blob_y + height],
            radius=int(min(width, height) * 0.45),
            fill=with_alpha(color, 238),
        )
    for _ in range(12):
        angle = rand.random() * math.tau
        dist = radius * rand.random() ** 0.6 * 0.6
        leaf_x = cx + math.cos(angle) * dist
        leaf_y = cy + math.sin(angle) * dist * 0.62
        leaf_w = radius * rand.uniform(0.03, 0.06)
        draw.ellipse(
            [leaf_x - leaf_w, leaf_y - leaf_w * 0.5, leaf_x + leaf_w, leaf_y + leaf_w * 0.5],
            fill=with_alpha(hex_rgb("#5E8C4A"), 235),
        )
    draw_steam(image, (cx, cy - int(radius * 0.45)), 0.9)


def watermark(image: Image.Image, text: str = "示意图 · 非实拍") -> None:
    draw = ImageDraw.Draw(image)
    label_font = font(24, bold=True)
    pad = 14
    text_width = draw.textlength(text, font=label_font)
    x = image.size[0] - text_width - pad * 2 - 26
    y = image.size[1] - 26 - 44
    draw.rounded_rectangle(
        [x, y, x + text_width + pad * 2, y + 44],
        radius=22,
        fill=(38, 36, 31, 168),
    )
    draw.text((x + pad, y + 8), text, font=label_font, fill=(255, 249, 238))


def brand_mark(image: Image.Image) -> None:
    draw = ImageDraw.Draw(image)
    mark_font = font(22, bold=True)
    draw.ellipse([46, 44, 66, 64], fill=hex_rgb("#2F7A57"))
    draw.text((76, 42), "今天吃什么", font=mark_font, fill=(60, 52, 42, 200))


def make_cover(recipe: dict, output: Path) -> None:
    cuisine = recipe["cuisine"]
    palette = CUISINE_PALETTES[cuisine]
    rand = rng_for(recipe["id"])
    width, height = COVER_SIZE[0] * SCALE, COVER_SIZE[1] * SCALE
    image = draw_background((width, height), cuisine)
    draw_table(image)

    kind = dish_kind(recipe)
    vessel = vessel_for(kind)
    center = (int(width * 0.52), int(height * 0.52))
    radius = int(width * 0.26)
    draw_vessel(image, center, radius, vessel, palette)
    draw_food(image, center, radius, kind, palette, rand)
    draw_chopsticks(image, int(width * 0.83), int(height * 0.56), int(width * 0.16), math.radians(64))

    draw = ImageDraw.Draw(image)
    title_font = font(int(58 * SCALE), bold=True)
    subtitle_font = font(int(24 * SCALE))
    name = recipe["name"]
    draw.text((int(64 * SCALE), int(height * 0.68)), name, font=title_font, fill=(46, 40, 32, 235))
    subtitle = recipe["subtitle"]
    draw.text((int(66 * SCALE), int(height * 0.68) + int(76 * SCALE)), subtitle, font=subtitle_font, fill=(88, 76, 62, 220))

    brand_mark(image)
    watermark(image)

    final = image.resize(COVER_SIZE, Image.Resampling.LANCZOS).convert("RGB")
    final.save(output, "PNG", optimize=True)


def pick_step_variant(step: dict) -> int:
    """按步骤文字推断动作图标，保证步骤图与实际操作对应。

    1 炒锅 / 2 刀与砧板 / 3 汤锅 / 4 计时器 / 5 装盘
    """
    text = f"{step.get('title', '')}{step.get('text', '')}"
    keyword_groups = {
        1: ("炒", "煎", "爆", "煸", "翻面", "翻炒", "收汁", "下锅"),
        2: ("切", "撕", "剁", "改刀", "洗净", "处理", "备好", "打散"),
        3: ("煮", "炖", "蒸", "焖", "焯", "煲", "烧开", "小火"),
        4: ("腌", "静置", "泡", "计时", "等待", "醒"),
        5: ("装盘", "摆盘", "盛盘"),
    }
    scores = {variant: sum(text.count(word) for word in words) for variant, words in keyword_groups.items()}
    best = max(scores, key=lambda variant: scores[variant])
    if scores[best] == 0:
        return (step["index"] % 5) + 1
    return best


def step_icon(variant: int, width: int, height: int, palette: tuple[str, ...]) -> Image.Image:
    icon = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(icon)
    accent = hex_rgb(palette[3])
    green = hex_rgb("#5E8C4A")

    if variant == 1:  # 炒锅
        draw.ellipse([width * 0.12, height * 0.3, width * 0.68, height * 0.78], fill=darken(accent, 0.1))
        draw.ellipse([width * 0.18, height * 0.36, width * 0.62, height * 0.72], fill=mix(accent, (255, 255, 255), 0.24))
        draw.rounded_rectangle(
            [width * 0.66, height * 0.46, width * 0.94, height * 0.52], radius=8, fill=hex_rgb("#6B4A32")
        )
        draw.arc([width * 0.24, height * 0.2, width * 0.56, height * 0.4], 200, 340, fill=(255, 255, 255, 200), width=6)
    elif variant == 2:  # 刀与砧板
        draw.rounded_rectangle(
            [width * 0.12, height * 0.44, width * 0.8, height * 0.82], radius=18, fill=hex_rgb("#D9B382")
        )
        draw.polygon(
            [
                (width * 0.46, height * 0.16),
                (width * 0.78, height * 0.3),
                (width * 0.62, height * 0.46),
                (width * 0.3, height * 0.3),
            ],
            fill=hex_rgb("#C9D3DA"),
        )
        draw.rounded_rectangle(
            [width * 0.2, height * 0.2, width * 0.36, height * 0.27], radius=6, fill=hex_rgb("#4A3B2C")
        )
    elif variant == 3:  # 汤锅
        draw.rounded_rectangle(
            [width * 0.2, height * 0.4, width * 0.76, height * 0.8], radius=22, fill=hex_rgb("#9AA6AE")
        )
        draw.rounded_rectangle(
            [width * 0.25, height * 0.44, width * 0.71, height * 0.6], radius=14, fill=mix(accent, (255, 255, 255), 0.2)
        )
        draw.line([(width * 0.18, height * 0.34), (width * 0.78, height * 0.34)], fill=hex_rgb("#6E7A82"), width=12)
        draw.ellipse([width * 0.4, height * 0.26, width * 0.56, height * 0.34], fill=hex_rgb("#4A3B2C"))
        draw.line([(width * 0.14, height * 0.5), (width * 0.22, height * 0.5)], fill=hex_rgb("#6E7A82"), width=10)
        draw.line([(width * 0.74, height * 0.5), (width * 0.82, height * 0.5)], fill=hex_rgb("#6E7A82"), width=10)
    elif variant == 4:  # 计时器
        draw.ellipse([width * 0.22, height * 0.22, width * 0.74, height * 0.74], fill=hex_rgb("#FDFAF4"))
        draw.ellipse([width * 0.26, height * 0.26, width * 0.7, height * 0.7], outline=accent, width=10)
        draw.line([(width * 0.48, height * 0.48), (width * 0.48, height * 0.34)], fill=hex_rgb("#4A3B2C"), width=8)
        draw.line([(width * 0.48, height * 0.48), (width * 0.6, height * 0.56)], fill=hex_rgb("#4A3B2C"), width=8)
        draw.rounded_rectangle(
            [width * 0.42, height * 0.12, width * 0.56, height * 0.2], radius=4, fill=accent
        )
    else:  # 装盘
        draw.ellipse([width * 0.1, height * 0.42, width * 0.82, height * 0.92], fill=hex_rgb("#FDFAF4"))
        draw.ellipse([width * 0.18, height * 0.48, width * 0.74, height * 0.84], fill=mix(accent, (255, 255, 255), 0.42))
        for index in range(5):
            cx = width * (0.28 + (index % 3) * 0.16)
            cy = height * (0.58 + (index // 3) * 0.14)
            size = width * 0.06
            draw.ellipse([cx - size, cy - size, cx + size, cy + size], fill=mix(accent, green, index / 6))
        draw.arc([width * 0.1, height * 0.46, width * 0.82, height * 0.9], 200, 340, fill=green, width=9)

    return icon


def make_step(recipe: dict, step: dict, output: Path) -> None:
    cuisine = recipe["cuisine"]
    palette = CUISINE_PALETTES[cuisine]
    width, height = STEP_SIZE[0] * SCALE, STEP_SIZE[1] * SCALE
    image = draw_background((width, height), cuisine)

    draw = ImageDraw.Draw(image)
    card = [int(48 * SCALE), int(46 * SCALE), int(width - 48 * SCALE), int(height - 46 * SCALE)]
    draw.rounded_rectangle(card, radius=int(34 * SCALE), fill=(255, 255, 255, 210), outline=(226, 212, 194, 220), width=3)

    icon = step_icon(pick_step_variant(step), int(width * 0.4), int(height * 0.42), palette)
    image.alpha_composite(icon, (int(width * 0.08), int(height * 0.22)))

    number_font = font(int(96 * SCALE), bold=True)
    label_font = font(int(42 * SCALE), bold=True)
    body_font = font(int(24 * SCALE))
    small_font = font(int(20 * SCALE))

    badge_x, badge_y = int(width * 0.58), int(height * 0.2)
    draw.rounded_rectangle(
        [badge_x, badge_y, badge_x + int(108 * SCALE), badge_y + int(108 * SCALE)],
        radius=int(28 * SCALE),
        fill=hex_rgb(palette[0]),
    )
    number_text = str(step["index"])
    number_width = draw.textlength(number_text, font=number_font)
    draw.text(
        (badge_x + (int(108 * SCALE) - number_width) / 2, badge_y + int(6 * SCALE)),
        number_text,
        font=number_font,
        fill=(255, 255, 255),
    )

    title_lines = wrap_text(draw, step["title"], label_font, int(width * 0.34))
    y = int(height * 0.36)
    for line in title_lines[:2]:
        draw.text((int(width * 0.585), y), line, font=label_font, fill=(46, 40, 32))
        y += int(56 * SCALE)

    hint_parts = []
    if step.get("heat"):
        hint_parts.append(f"火候 {step['heat']}")
    if step.get("timeHint"):
        hint_parts.append(step["timeHint"])
    if hint_parts:
        draw.text((int(width * 0.585), y + int(10 * SCALE)), " · ".join(hint_parts), font=body_font, fill=(116, 104, 88))

    footer = f"步骤 {step['index']} · {recipe['name']} · 示意图，非实拍"
    draw.text((int(width * 0.09), int(height * 0.78)), footer, font=small_font, fill=(126, 112, 96))
    draw.rounded_rectangle(
        [int(width * 0.09), int(height * 0.87), int(width * 0.09) + int(width * 0.16), int(height * 0.87) + 8],
        radius=4,
        fill=hex_rgb(palette[0]),
    )

    final = image.resize(STEP_SIZE, Image.Resampling.LANCZOS).convert("RGB")
    final.save(output, "PNG", optimize=True)


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", help="只生成指定菜谱 id")
    args = parser.parse_args()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    files = sorted(RECIPE_DIR.glob("*.json"))
    if args.only:
        files = [RECIPE_DIR / f"{args.only}.json"]

    total = 0
    for path in files:
        recipe = json.loads(path.read_text(encoding="utf-8"))
        cover_path = OUTPUT_DIR / f"{recipe['id']}.png"
        make_cover(recipe, cover_path)
        total += 1
        for step in recipe["steps"]:
            step_path = OUTPUT_DIR / f"{recipe['id']}-step-{step['index']}.png"
            make_step(recipe, step, step_path)
            total += 1
        print(f"  ✓ {recipe['name']}: 1 张成品图 + {len(recipe['steps'])} 张步骤图")

    print(f"\n共生成 {total} 张示意图 → {OUTPUT_DIR.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
