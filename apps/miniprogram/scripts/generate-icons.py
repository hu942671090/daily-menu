#!/usr/bin/env python3
"""生成微信小程序 tabBar 图标（81x81 PNG，普通态 / 选中态）。

图标为简单的线性图案，与项目其他示意图一致，均为脚本原创绘制。
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[3]
OUTPUT = ROOT / "apps" / "miniprogram" / "images"
SIZE = 81
SCALE = 4

COLOR_NORMAL = (114, 107, 95, 255)
COLOR_ACTIVE = (47, 122, 87, 255)


def canvas() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new("RGBA", (SIZE * SCALE, SIZE * SCALE), (0, 0, 0, 0))
    return image, ImageDraw.Draw(image)


def home(draw: ImageDraw.ImageDraw, color, s: float) -> None:
    draw.line(
        [(20 * s, 40 * s), (40 * s, 21 * s), (61 * s, 40 * s)],
        fill=color,
        width=int(6 * s),
        joint="curve",
    )
    draw.line([(24 * s, 39 * s), (24 * s, 61 * s), (57 * s, 61 * s), (57 * s, 39 * s)], fill=color, width=int(6 * s), joint="curve")
    draw.line([(35 * s, 61 * s), (35 * s, 48 * s), (46 * s, 48 * s), (46 * s, 61 * s)], fill=color, width=int(5 * s))


def calendar(draw: ImageDraw.ImageDraw, color, s: float) -> None:
    draw.rounded_rectangle([18 * s, 24 * s, 63 * s, 62 * s], radius=int(8 * s), outline=color, width=int(5 * s))
    draw.line([(18 * s, 36 * s), (63 * s, 36 * s)], fill=color, width=int(4 * s))
    draw.line([(30 * s, 17 * s), (30 * s, 27 * s)], fill=color, width=int(6 * s))
    draw.line([(51 * s, 17 * s), (51 * s, 27 * s)], fill=color, width=int(6 * s))
    for x, y in ((28, 44), (40, 44), (52, 44), (28, 53), (40, 53)):
        draw.ellipse([x * s, y * s, (x + 4) * s, (y + 4) * s], fill=color)


def compass(draw: ImageDraw.ImageDraw, color, s: float) -> None:
    draw.ellipse([17 * s, 17 * s, 64 * s, 64 * s], outline=color, width=int(5 * s))
    draw.polygon([(49 * s, 30 * s), (43 * s, 45 * s), (32 * s, 51 * s), (38 * s, 36 * s)], outline=color, width=int(4 * s))


def heart(draw: ImageDraw.ImageDraw, color, s: float) -> None:
    draw.arc([19 * s, 22 * s, 43 * s, 46 * s], start=150, end=360, fill=color, width=int(6 * s))
    draw.arc([38 * s, 22 * s, 62 * s, 46 * s], start=180, end=390, fill=color, width=int(6 * s))
    draw.line([(19 * s, 36 * s), (40 * s, 61 * s)], fill=color, width=int(6 * s))
    draw.line([(62 * s, 36 * s), (40 * s, 61 * s)], fill=color, width=int(6 * s))


def gear(draw: ImageDraw.ImageDraw, color, s: float) -> None:
    cx, cy = 40.5, 40.5
    draw.ellipse([30 * s, 30 * s, 51 * s, 51 * s], outline=color, width=int(5 * s))
    for index in range(8):
        import math

        angle = index * math.pi / 4
        x1 = cx + math.cos(angle) * 15 * s
        y1 = cy + math.sin(angle) * 15 * s
        x2 = cx + math.cos(angle) * 23 * s
        y2 = cy + math.sin(angle) * 23 * s
        draw.line([(x1, y1), (x2, y2)], fill=color, width=int(5 * s))


ICONS = {
    "home": home,
    "week": calendar,
    "discover": compass,
    "favorites": heart,
    "preferences": gear,
}


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name, painter in ICONS.items():
        for suffix, color in (("", COLOR_NORMAL), ("-active", COLOR_ACTIVE)):
            image, draw = canvas()
            painter(draw, color, SCALE)
            image = image.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
            image.save(OUTPUT / f"tab-{name}{suffix}.png", "PNG", optimize=True)
    print(f"已生成 {len(ICONS) * 2} 个 tabBar 图标 → {OUTPUT}")


if __name__ == "__main__":
    main()
