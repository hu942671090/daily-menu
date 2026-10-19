# 菜谱图片交接文档（给 GPT / 图像模型）

> 自动生成于 2026-10-19T09:17:46.237Z · 对应项目：https://github.com/hu942671090/daily-menu
> 用途：把项目中的示意配图替换为更真实的菜品图；**AI 生成图需明确标注，不能声称实拍**。

## 1. 怎么把需求交给 GPT

**方式 A（推荐）**：把本文件上传给 GPT（ChatGPT 支持上传 .md/.txt），再把下面这段起始指令粘贴过去。

**方式 B**：直接发公开链接给支持联网的 GPT：

```text
https://raw.githubusercontent.com/hu942671090/daily-menu/main/docs/recipe-image-handoff.md
```

**方式 C**：把某一道菜的 JSON 和本节提示词一起贴过去，让 GPT 先试一张。

> 说明：当前对话在 DeepSeek Harness 中，没有“一键转发到 GPT”的按钮；本文件就是可移植的交接材料。

## 2. 直接复制给 GPT 的起始指令

```text
你是食物摄影与图像生成助手。我要为「今天吃什么」项目生成 25 道中国家庭菜的成品图。

请阅读我上传的《菜谱图片交接文档》（recipe-image-handoff.md），严格按里面每道菜的提示词出图：
- 每张 1536×1024（3:2 横图），下载后我会缩放到 1200×800；
- 真实食物摄影风格，暖白自然光，浅色木桌，陶瓷器皿，45° 微俯拍；
- 只出现这一道菜和简单餐具，不要文字、水印、logo、人物、手；
- 食材必须与提示词一致，不要添加菜谱里没有的食材。

先做清单里的前 5 道，做完后停下来让我确认风格；确认后继续剩下的菜。每张图请告诉我对应的菜名和文件名（例如 tomato-scrambled-egg.png）。
```

## 3. 统一风格要求

- **统一风格**：真实、温暖的家庭餐桌食物摄影；暖白自然光从左侧来；浅色橡木桌面；陶瓷器皿；45° 微俯拍；浅景深；不过度饱和。
- **画面只出现这一道菜**：可以有一小碟蘸料、筷子、餐巾作为点缀，但不要出现其他主菜、人物、手、品牌包装。
- **不要生成文字**：模型很容易把中文写错；菜名、标签由网页叠加，不要画进图里。
- **食材必须与菜谱一致**：以 JSON 中的 `mainIngredients` 为准，不添加菜谱里没有的食材（尤其是肉类、海鲜、花生等过敏原）。
- **尺寸**：GPT 图像通常输出 1536×1024（3:2）。下载后缩放到 **1200×800**，或按 3:2 居中裁切；文件保存为 PNG。
- **图片性质**：AI 生成图必须标注「AI 生成示意图，非实拍」，不得标成 `photo`，也不得声称是真实拍摄。

## 4. 25 道菜的出图提示词

建议按顺序做，每张图保存为对应的 `filename`。提示词可直接复制给 GPT；如果模型支持负面提示词，使用文末的 `negative`。

### 1. 葱油拌面（`scallion-oil-noodles`）

- 英文名：scallion oil noodles
- 菜系/口味：江浙 · 咸鲜 / 酱香
- 主要食材：面条、小葱、生抽
- 文件名：`scallion-oil-noodles.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of scallion oil noodles (葱油拌面), thin noodles coated in dark scallion oil, crispy fried scallions on top, chopsticks lifting a few strands. Served in a white ceramic bowl, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade Jiangnan cooking, accurate ingredients (面条, 小葱, 生抽), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 2. 冬瓜丸子汤（`winter-melon-meatball-soup`）

- 英文名：winter melon meatball soup
- 菜系/口味：家常菜 · 清淡 / 咸鲜
- 主要食材：冬瓜、猪肉馅、鸡蛋、姜、小葱
- 文件名：`winter-melon-meatball-soup.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of winter melon meatball soup (冬瓜丸子汤), clear broth with tender pork meatballs, translucent winter melon chunks and scallion. Served in a white ceramic bowl, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade home-style Chinese cooking, accurate ingredients (冬瓜, 猪肉馅, 鸡蛋, 姜, 小葱), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 3. 番茄炒蛋（`tomato-scrambled-egg`）

- 英文名：tomato scrambled eggs
- 菜系/口味：家常菜 · 咸鲜 / 微甜
- 主要食材：番茄、鸡蛋
- 文件名：`tomato-scrambled-egg.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of tomato scrambled eggs (番茄炒蛋), soft golden scrambled eggs with bright red tomato chunks in a glossy sauce, scallion garnish. Served in a white ceramic plate, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade home-style Chinese cooking, accurate ingredients (番茄, 鸡蛋), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 4. 番茄牛腩（`tomato-beef-brisket`）

- 英文名：tomato beef brisket stew
- 菜系/口味：家常菜 · 酸甜 / 咸鲜
- 主要食材：牛腩、番茄、洋葱、姜
- 文件名：`tomato-beef-brisket.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of tomato beef brisket stew (番茄牛腩), chunks of tender beef brisket and tomato in a rich red-orange broth, scallion garnish. Served in a white ceramic bowl, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade home-style Chinese cooking, accurate ingredients (牛腩, 番茄, 洋葱, 姜), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 5. 番茄牛肉面（`tomato-beef-noodle`）

- 英文名：tomato beef noodle soup
- 菜系/口味：家常菜 · 酸甜 / 咸鲜
- 主要食材：牛腩、番茄、面条、小葱
- 文件名：`tomato-beef-noodle.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of tomato beef noodle soup (番茄牛肉面), wheat noodles in a tomato beef broth, sliced beef, fresh tomato chunks and scallion. Served in a white ceramic bowl, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade home-style Chinese cooking, accurate ingredients (牛腩, 番茄, 面条, 小葱), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 6. 宫保鸡丁（`kung-pao-chicken`）

- 英文名：kung pao chicken
- 菜系/口味：川湘 · 香辣 / 酸甜
- 主要食材：鸡腿肉、花生米、干辣椒、大葱
- 文件名：`kung-pao-chicken.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of kung pao chicken (宫保鸡丁), diced chicken, roasted peanuts, dried red chilies and scallion pieces in a dark glossy sauce. Served in a white ceramic plate, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade Sichuan-Hunan cooking, accurate ingredients (鸡腿肉, 花生米, 干辣椒, 大葱), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 7. 蚝油生菜（`oyster-sauce-lettuce`）

- 英文名：lettuce with oyster sauce
- 菜系/口味：粤式 · 咸鲜 / 蒜香
- 主要食材：生菜、大蒜
- 文件名：`oyster-sauce-lettuce.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of lettuce with oyster sauce (蚝油生菜), bright green blanched lettuce leaves with glossy oyster sauce, minced garlic and a light shine. Served in a white ceramic plate, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade Cantonese cooking, accurate ingredients (生菜, 大蒜), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 8. 红烧肉（`braised-pork`）

- 英文名：braised pork belly
- 菜系/口味：家常菜 · 酱香 / 微甜
- 主要食材：带皮五花肉、姜、大葱、八角、桂皮
- 文件名：`braised-pork.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of braised pork belly (红烧肉), glossy caramelized pork belly cubes in a rich dark soy glaze, scallion garnish, a few pieces of star anise. Served in a white ceramic bowl, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade home-style Chinese cooking, accurate ingredients (带皮五花肉, 姜, 大葱, 八角, 桂皮), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 9. 火腿芝士三明治（`ham-cheese-sandwich`）

- 英文名：ham and cheese sandwich
- 菜系/口味：西式 · 奶香 / 咸鲜
- 主要食材：吐司、火腿片、芝士片、生菜、番茄
- 文件名：`ham-cheese-sandwich.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of ham and cheese sandwich (火腿芝士三明治), toasted bread cut diagonally, melted cheese, folded ham, crisp lettuce and tomato slices, a few potato chips on the side. Served in a wooden serving board, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade Western cooking, accurate ingredients (吐司, 火腿片, 芝士片, 生菜, 番茄), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 10. 麻婆豆腐（`mapo-tofu`）

- 英文名：mapo tofu
- 菜系/口味：川湘 · 香辣 / 咸鲜
- 主要食材：嫩豆腐、猪肉末、蒜苗
- 文件名：`mapo-tofu.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of mapo tofu (麻婆豆腐), soft white tofu cubes in bright red chili oil with minced pork, chopped garlic sprouts and Sichuan pepper. Served in a white ceramic bowl, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade Sichuan-Hunan cooking, accurate ingredients (嫩豆腐, 猪肉末, 蒜苗), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 11. 皮蛋瘦肉粥（`century-egg-pork-porridge`）

- 英文名：century egg and pork congee
- 菜系/口味：粤式 · 咸鲜 / 鲜香
- 主要食材：大米、猪里脊、皮蛋、姜
- 文件名：`century-egg-pork-porridge.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of century egg and pork congee (皮蛋瘦肉粥), creamy rice congee with dark century egg pieces, tender pork slivers, julienned ginger and scallion. Served in a white ceramic bowl, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade Cantonese cooking, accurate ingredients (大米, 猪里脊, 皮蛋, 姜), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 12. 青椒肉丝（`green-pepper-pork`）

- 英文名：stir-fried pork with green peppers
- 菜系/口味：家常菜 · 咸鲜 / 鲜香
- 主要食材：猪里脊、青椒、大蒜
- 文件名：`green-pepper-pork.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of stir-fried pork with green peppers (青椒肉丝), tender pork shreds and bright green pepper strips in a glossy savory sauce, garlic slices. Served in a white ceramic plate, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade home-style Chinese cooking, accurate ingredients (猪里脊, 青椒, 大蒜), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 13. 清蒸鲈鱼（`steamed-seabass`）

- 英文名：steamed sea bass
- 菜系/口味：粤式 · 清淡 / 咸鲜
- 主要食材：鲈鱼、姜、小葱、红椒
- 文件名：`steamed-seabass.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of steamed sea bass (清蒸鲈鱼), whole steamed sea bass with julienned ginger, scallion and red chili, light soy sauce pooled around. Served in a oval white plate, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade Cantonese cooking, accurate ingredients (鲈鱼, 姜, 小葱, 红椒), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 14. 三鲜水饺（`three-fresh-dumplings`）

- 英文名：boiled dumplings
- 菜系/口味：北方 · 咸鲜 / 鲜香
- 主要食材：猪肉馅、虾仁、鸡蛋、韭菜、饺子皮
- 文件名：`three-fresh-dumplings.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of boiled dumplings (三鲜水饺), plump boiled dumplings with pleated edges, a small dish of black vinegar and chili oil, chopsticks. Served in a white ceramic plate, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade northern Chinese cooking, accurate ingredients (猪肉馅, 虾仁, 鸡蛋, 韭菜, 饺子皮), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 15. 手撕包菜（`hand-torn-cabbage`）

- 英文名：hand-torn stir-fried cabbage
- 菜系/口味：家常菜 · 蒜香 / 香辣
- 主要食材：包菜、大蒜、干辣椒
- 文件名：`hand-torn-cabbage.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of hand-torn stir-fried cabbage (手撕包菜), charred hand-torn cabbage leaves with dried red chilies, garlic slices and a glossy sauce. Served in a rustic white plate, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade home-style Chinese cooking, accurate ingredients (包菜, 大蒜, 干辣椒), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 16. 蔬菜鸡蛋饼（`egg-veggie-pancake`）

- 英文名：vegetable egg pancake
- 菜系/口味：家常菜 · 咸鲜 / 鲜香
- 主要食材：鸡蛋、面粉、胡萝卜、小葱
- 文件名：`egg-veggie-pancake.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of vegetable egg pancake (蔬菜鸡蛋饼), golden pan-fried egg pancake cut into wedges, visible shredded carrot and green scallion, small dipping sauce dish. Served in a white round plate, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade home-style Chinese cooking, accurate ingredients (鸡蛋, 面粉, 胡萝卜, 小葱), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 17. 酸奶水果燕麦碗（`yogurt-fruit-bowl`）

- 英文名：yogurt fruit and granola bowl
- 菜系/口味：轻食 · 酸甜 / 奶香
- 主要食材：无糖酸奶、燕麦片、蓝莓、香蕉
- 文件名：`yogurt-fruit-bowl.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of yogurt fruit and granola bowl (酸奶水果燕麦碗), thick white yogurt topped with blueberries, banana slices, crunchy granola and a drizzle of honey. Served in a clear glass bowl, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade light and healthy cooking, accurate ingredients (无糖酸奶, 燕麦片, 蓝莓, 香蕉), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 18. 蒜蓉粉丝蒸虾（`garlic-vermicelli-shrimp`）

- 英文名：steamed garlic shrimp with vermicelli
- 菜系/口味：粤式 · 蒜香 / 咸鲜
- 主要食材：大虾、龙口粉丝、大蒜、小米辣
- 文件名：`garlic-vermicelli-shrimp.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of steamed garlic shrimp with vermicelli (蒜蓉粉丝蒸虾), butterflied large shrimp on a bed of translucent glass noodles, topped with minced garlic, scallion and red chili. Served in a oval white plate, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade Cantonese cooking, accurate ingredients (大虾, 龙口粉丝, 大蒜, 小米辣), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 19. 蒜蓉西兰花（`garlic-broccoli`）

- 英文名：garlic stir-fried broccoli
- 菜系/口味：家常菜 · 清淡 / 蒜香
- 主要食材：西兰花、大蒜
- 文件名：`garlic-broccoli.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of garlic stir-fried broccoli (蒜蓉西兰花), vibrant green broccoli florets with golden garlic bits and a light glossy sauce. Served in a white ceramic plate, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade home-style Chinese cooking, accurate ingredients (西兰花, 大蒜), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 20. 土豆炖排骨（`potato-rib-stew`）

- 英文名：potato and pork rib stew
- 菜系/口味：北方 · 酱香 / 咸鲜
- 主要食材：猪肋排、土豆、姜、大葱、八角
- 文件名：`potato-rib-stew.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of potato and pork rib stew (土豆炖排骨), tender pork ribs and golden potato chunks in a savory braising sauce, scallion garnish. Served in a white ceramic bowl, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade northern Chinese cooking, accurate ingredients (猪肋排, 土豆, 姜, 大葱, 八角), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 21. 香煎三文鱼（`pan-seared-salmon`）

- 英文名：pan-seared salmon fillet
- 菜系/口味：西式 · 清淡 / 鲜香
- 主要食材：三文鱼排、柠檬、芦笋、大蒜
- 文件名：`pan-seared-salmon.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of pan-seared salmon fillet (香煎三文鱼), crispy-skinned salmon fillet with charred asparagus, a lemon wedge and cracked black pepper. Served in a white ceramic plate, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade Western cooking, accurate ingredients (三文鱼排, 柠檬, 芦笋, 大蒜), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 22. 小米南瓜粥（`millet-pumpkin-porridge`）

- 英文名：millet and pumpkin porridge
- 菜系/口味：家常菜 · 清淡 / 微甜
- 主要食材：小米、南瓜
- 文件名：`millet-pumpkin-porridge.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of millet and pumpkin porridge (小米南瓜粥), golden-yellow millet porridge with soft pumpkin cubes, gentle steam, a small spoon beside. Served in a white ceramic bowl, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade home-style Chinese cooking, accurate ingredients (小米, 南瓜), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 23. 燕麦牛奶粥（`oat-milk-porridge`）

- 英文名：oatmeal milk porridge
- 菜系/口味：轻食 · 奶香 / 微甜
- 主要食材：即食燕麦片、牛奶、香蕉
- 文件名：`oat-milk-porridge.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of oatmeal milk porridge (燕麦牛奶粥), creamy oat porridge with banana slices, a milk swirl and a few oats on top. Served in a white ceramic bowl, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade light and healthy cooking, accurate ingredients (即食燕麦片, 牛奶, 香蕉), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 24. 鱼香茄子（`fish-fragrant-eggplant`）

- 英文名：fish-fragrant eggplant
- 菜系/口味：川湘 · 酸甜 / 香辣
- 主要食材：长茄子、猪肉末、泡椒
- 文件名：`fish-fragrant-eggplant.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of fish-fragrant eggplant (鱼香茄子), glossy purple eggplant strips in a red garlic chili sauce with minced pork, pickled red chilies and scallion. Served in a white ceramic plate, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade Sichuan-Hunan cooking, accurate ingredients (长茄子, 猪肉末, 泡椒), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

### 25. 照烧鸡腿饭（`teriyaki-chicken-rice`）

- 英文名：teriyaki chicken rice bowl
- 菜系/口味：日韩 · 咸鲜 / 微甜
- 主要食材：鸡腿肉、米饭、西兰花
- 文件名：`teriyaki-chicken-rice.png` · 尺寸：1200x800 (3:2)

```text
Realistic editorial food photography of teriyaki chicken rice bowl (照烧鸡腿饭), sliced glazed teriyaki chicken thigh over steamed rice, broccoli florets, sesame seeds. Served in a white ceramic bowl, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows. 45-degree angle, shallow depth of field, appetizing homemade Japanese-Korean cooking, accurate ingredients (鸡腿肉, 米饭, 西兰花), 3:2 landscape, high detail. Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```

## 5. 步骤图怎么办

结论：**首版建议只替换成品图，步骤图继续保留当前的示意图**。

原因：一道菜 4–6 步，25 道菜约 133 张；图像模型很难保证同一道菜在多个步骤里锅具、食材状态和光线一致，容易出现“步骤 3 的菜和成品不是同一道”的问题。当前项目的步骤图已经带编号和“示意图，非实拍”标注，是诚实的占位方案。

如果仍想尝试，给 GPT 的步骤提示词模板：

```text
Realistic cooking-process photo for step {N} of {dish name}: {step title}. {step text}. Same kitchen, same cookware and ingredients as the finished dish, warm natural light, 3:2 landscape, no text, no watermark, no people, no hands. Keep the food consistency with the reference image.
```

生成后必须逐张人工核对：锅具、食材、火候、步骤顺序是否与文字一致；不一致就不要用。

## 6. 拿到图片后怎么替换

1. 把成品图缩放/裁切为 **1200×800 PNG**，命名为 `<菜谱 id>.png`；
2. 覆盖到 `packages/content/images/recipes/`（先备份原示意图）；
3. 修改对应菜谱 JSON 的 `image` 字段：
   - AI 生成：保留 `kind: "illustration"`，`note` 改为 `"AI 生成示意图，非实拍"`，`credit` 写明模型与生成日期；
   - 真实拍摄且拥有授权：改为 `kind: "photo"`，`credit` 写作者与许可；
4. 执行 `npm run data:validate` 与 `npm run data:build`；
5. 重新执行 `npm run build:static`，更新 GitHub Pages 的 `gh-pages` 分支。

> ⚠️ 不要直接运行 `npm run data:images`：它会重新生成并**覆盖**你刚放进去的图片。替换真实/AI 图后，应跳过该脚本，或先备份。

## 7. 合规与真实性

- AI 生成图必须标注，不得作为“实拍”宣传；
- 不要生成品牌 logo、名人肖像、受版权保护的角色；
- 不要为了好看添加菜谱里没有的食材，尤其是过敏原；
- 同一张图不能复用于多道菜；步骤图也不能复用成品图；
- 正式上线前建议逐步替换为有明确授权的实拍图。

## 8. 机器可读版本

同目录的 `recipe-image-prompts.json` 包含同样的结构化提示词，方便脚本或 API 直接读取。

## 9. 负面提示词

```text
Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.
```
