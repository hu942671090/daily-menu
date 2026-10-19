#!/usr/bin/env node
/**
 * 生成「菜谱图片交接文档」，用于把出图需求交给 ChatGPT / 其他图像模型。
 * 读取 packages/content/data/recipes/*.json，输出：
 *   docs/recipe-image-handoff.md
 *   docs/recipe-image-prompts.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const recipeDir = path.join(root, 'packages/content/data/recipes');
const docsDir = path.join(root, 'docs');

const CUISINE_EN = {
  家常菜: 'home-style Chinese',
  川湘: 'Sichuan-Hunan',
  粤式: 'Cantonese',
  江浙: 'Jiangnan',
  北方: 'northern Chinese',
  西式: 'Western',
  日韩: 'Japanese-Korean',
  轻食: 'light and healthy',
};

/** 每道菜的英文名、器皿与画面细节（人工整理，避免模型画错食材） */
const META = {
  'braised-pork': {
    en: 'braised pork belly',
    vessel: 'white ceramic bowl',
    details:
      'glossy caramelized pork belly cubes in a rich dark soy glaze, scallion garnish, a few pieces of star anise',
  },
  'century-egg-pork-porridge': {
    en: 'century egg and pork congee',
    vessel: 'white ceramic bowl',
    details:
      'creamy rice congee with dark century egg pieces, tender pork slivers, julienned ginger and scallion',
  },
  'egg-veggie-pancake': {
    en: 'vegetable egg pancake',
    vessel: 'white round plate',
    details:
      'golden pan-fried egg pancake cut into wedges, visible shredded carrot and green scallion, small dipping sauce dish',
  },
  'fish-fragrant-eggplant': {
    en: 'fish-fragrant eggplant',
    vessel: 'white ceramic plate',
    details:
      'glossy purple eggplant strips in a red garlic chili sauce with minced pork, pickled red chilies and scallion',
  },
  'garlic-broccoli': {
    en: 'garlic stir-fried broccoli',
    vessel: 'white ceramic plate',
    details:
      'vibrant green broccoli florets with golden garlic bits and a light glossy sauce',
  },
  'garlic-vermicelli-shrimp': {
    en: 'steamed garlic shrimp with vermicelli',
    vessel: 'oval white plate',
    details:
      'butterflied large shrimp on a bed of translucent glass noodles, topped with minced garlic, scallion and red chili',
  },
  'green-pepper-pork': {
    en: 'stir-fried pork with green peppers',
    vessel: 'white ceramic plate',
    details:
      'tender pork shreds and bright green pepper strips in a glossy savory sauce, garlic slices',
  },
  'ham-cheese-sandwich': {
    en: 'ham and cheese sandwich',
    vessel: 'wooden serving board',
    details:
      'toasted bread cut diagonally, melted cheese, folded ham, crisp lettuce and tomato slices, a few potato chips on the side',
  },
  'hand-torn-cabbage': {
    en: 'hand-torn stir-fried cabbage',
    vessel: 'rustic white plate',
    details:
      'charred hand-torn cabbage leaves with dried red chilies, garlic slices and a glossy sauce',
  },
  'kung-pao-chicken': {
    en: 'kung pao chicken',
    vessel: 'white ceramic plate',
    details:
      'diced chicken, roasted peanuts, dried red chilies and scallion pieces in a dark glossy sauce',
  },
  'mapo-tofu': {
    en: 'mapo tofu',
    vessel: 'white ceramic bowl',
    details:
      'soft white tofu cubes in bright red chili oil with minced pork, chopped garlic sprouts and Sichuan pepper',
  },
  'millet-pumpkin-porridge': {
    en: 'millet and pumpkin porridge',
    vessel: 'white ceramic bowl',
    details:
      'golden-yellow millet porridge with soft pumpkin cubes, gentle steam, a small spoon beside',
  },
  'oat-milk-porridge': {
    en: 'oatmeal milk porridge',
    vessel: 'white ceramic bowl',
    details:
      'creamy oat porridge with banana slices, a milk swirl and a few oats on top',
  },
  'oyster-sauce-lettuce': {
    en: 'lettuce with oyster sauce',
    vessel: 'white ceramic plate',
    details:
      'bright green blanched lettuce leaves with glossy oyster sauce, minced garlic and a light shine',
  },
  'pan-seared-salmon': {
    en: 'pan-seared salmon fillet',
    vessel: 'white ceramic plate',
    details:
      'crispy-skinned salmon fillet with charred asparagus, a lemon wedge and cracked black pepper',
  },
  'potato-rib-stew': {
    en: 'potato and pork rib stew',
    vessel: 'white ceramic bowl',
    details:
      'tender pork ribs and golden potato chunks in a savory braising sauce, scallion garnish',
  },
  'scallion-oil-noodles': {
    en: 'scallion oil noodles',
    vessel: 'white ceramic bowl',
    details:
      'thin noodles coated in dark scallion oil, crispy fried scallions on top, chopsticks lifting a few strands',
  },
  'steamed-seabass': {
    en: 'steamed sea bass',
    vessel: 'oval white plate',
    details:
      'whole steamed sea bass with julienned ginger, scallion and red chili, light soy sauce pooled around',
  },
  'teriyaki-chicken-rice': {
    en: 'teriyaki chicken rice bowl',
    vessel: 'white ceramic bowl',
    details:
      'sliced glazed teriyaki chicken thigh over steamed rice, broccoli florets, sesame seeds',
  },
  'three-fresh-dumplings': {
    en: 'boiled dumplings',
    vessel: 'white ceramic plate',
    details:
      'plump boiled dumplings with pleated edges, a small dish of black vinegar and chili oil, chopsticks',
  },
  'tomato-beef-brisket': {
    en: 'tomato beef brisket stew',
    vessel: 'white ceramic bowl',
    details:
      'chunks of tender beef brisket and tomato in a rich red-orange broth, scallion garnish',
  },
  'tomato-beef-noodle': {
    en: 'tomato beef noodle soup',
    vessel: 'white ceramic bowl',
    details:
      'wheat noodles in a tomato beef broth, sliced beef, fresh tomato chunks and scallion',
  },
  'tomato-scrambled-egg': {
    en: 'tomato scrambled eggs',
    vessel: 'white ceramic plate',
    details:
      'soft golden scrambled eggs with bright red tomato chunks in a glossy sauce, scallion garnish',
  },
  'winter-melon-meatball-soup': {
    en: 'winter melon meatball soup',
    vessel: 'white ceramic bowl',
    details:
      'clear broth with tender pork meatballs, translucent winter melon chunks and scallion',
  },
  'yogurt-fruit-bowl': {
    en: 'yogurt fruit and granola bowl',
    vessel: 'clear glass bowl',
    details:
      'thick white yogurt topped with blueberries, banana slices, crunchy granola and a drizzle of honey',
  },
};

const NEGATIVE =
  'Avoid text, Chinese characters, watermarks, logos, people, hands, cartoon or 3D-render style, plastic-looking food, oversaturated colors, duplicated utensils, and ingredients that are not in the dish.';

const recipes = fs
  .readdirSync(recipeDir)
  .filter((file) => file.endsWith('.json'))
  .map((file) => JSON.parse(fs.readFileSync(path.join(recipeDir, file), 'utf8')))
  .sort((left, right) => left.name.localeCompare(right.name, 'zh-Hans-CN'));

function buildPrompt(recipe) {
  const meta = META[recipe.id];
  if (!meta) throw new Error(`缺少图片元数据：${recipe.id}`);
  const cuisine = CUISINE_EN[recipe.cuisine] ?? recipe.cuisine;
  return [
    `Realistic editorial food photography of ${meta.en} (${recipe.name}), ${meta.details}.`,
    `Served in a ${meta.vessel}, on a light oak table with a linen napkin and chopsticks, warm natural window light from the left, soft shadows.`,
    `45-degree angle, shallow depth of field, appetizing homemade ${cuisine} cooking, accurate ingredients (${recipe.mainIngredients.join(', ')}), 3:2 landscape, high detail.`,
    NEGATIVE,
  ].join(' ');
}

const images = recipes.map((recipe, index) => ({
  index: index + 1,
  id: recipe.id,
  name: recipe.name,
  en: META[recipe.id].en,
  cuisine: recipe.cuisine,
  tastes: recipe.tastes,
  mainIngredients: recipe.mainIngredients,
  filename: `${recipe.id}.png`,
  size: '1200x800 (3:2)',
  prompt: buildPrompt(recipe),
}));

const styleGuide = [
  '**统一风格**：真实、温暖的家庭餐桌食物摄影；暖白自然光从左侧来；浅色橡木桌面；陶瓷器皿；45° 微俯拍；浅景深；不过度饱和。',
  '**画面只出现这一道菜**：可以有一小碟蘸料、筷子、餐巾作为点缀，但不要出现其他主菜、人物、手、品牌包装。',
  '**不要生成文字**：模型很容易把中文写错；菜名、标签由网页叠加，不要画进图里。',
  '**食材必须与菜谱一致**：以 JSON 中的 `mainIngredients` 为准，不添加菜谱里没有的食材（尤其是肉类、海鲜、花生等过敏原）。',
  '**尺寸**：GPT 图像通常输出 1536×1024（3:2）。下载后缩放到 **1200×800**，或按 3:2 居中裁切；文件保存为 PNG。',
  '**图片性质**：AI 生成图必须标注「AI 生成示意图，非实拍」，不得标成 `photo`，也不得声称是真实拍摄。',
];

const jsonPayload = {
  project: 'daily-menu / 今天吃什么',
  generatedAt: new Date().toISOString(),
  purpose: '为 25 道菜生成成品图，替换项目中的示意图',
  size: '1200x800',
  aspectRatio: '3:2',
  styleGuide,
  negative: NEGATIVE,
  images,
};

const starterPrompt = `你是食物摄影与图像生成助手。我要为「今天吃什么」项目生成 25 道中国家庭菜的成品图。

请阅读我上传的《菜谱图片交接文档》（recipe-image-handoff.md），严格按里面每道菜的提示词出图：
- 每张 1536×1024（3:2 横图），下载后我会缩放到 1200×800；
- 真实食物摄影风格，暖白自然光，浅色木桌，陶瓷器皿，45° 微俯拍；
- 只出现这一道菜和简单餐具，不要文字、水印、logo、人物、手；
- 食材必须与提示词一致，不要添加菜谱里没有的食材。

先做清单里的前 5 道，做完后停下来让我确认风格；确认后继续剩下的菜。每张图请告诉我对应的菜名和文件名（例如 tomato-scrambled-egg.png）。`;

const md = [
  '# 菜谱图片交接文档（给 GPT / 图像模型）',
  '',
  `> 自动生成于 ${new Date().toISOString()} · 对应项目：https://github.com/hu942671090/daily-menu`,
  '> 用途：把项目中的示意配图替换为更真实的菜品图；**AI 生成图需明确标注，不能声称实拍**。',
  '',
  '## 1. 怎么把需求交给 GPT',
  '',
  '**方式 A（推荐）**：把本文件上传给 GPT（ChatGPT 支持上传 .md/.txt），再把下面这段起始指令粘贴过去。',
  '',
  '**方式 B**：直接发公开链接给支持联网的 GPT：',
  '',
  '```text',
  'https://raw.githubusercontent.com/hu942671090/daily-menu/main/docs/recipe-image-handoff.md',
  '```',
  '',
  '**方式 C**：把某一道菜的 JSON 和本节提示词一起贴过去，让 GPT 先试一张。',
  '',
  '> 说明：当前对话在 DeepSeek Harness 中，没有“一键转发到 GPT”的按钮；本文件就是可移植的交接材料。',
  '',
  '## 2. 直接复制给 GPT 的起始指令',
  '',
  '```text',
  starterPrompt,
  '```',
  '',
  '## 3. 统一风格要求',
  '',
  ...styleGuide.map((line) => `- ${line}`),
  '',
  '## 4. 25 道菜的出图提示词',
  '',
  '建议按顺序做，每张图保存为对应的 `filename`。提示词可直接复制给 GPT；如果模型支持负面提示词，使用文末的 `negative`。',
  '',
  ...images.flatMap((image) => [
    `### ${image.index}. ${image.name}（\`${image.id}\`）`,
    '',
    `- 英文名：${image.en}`,
    `- 菜系/口味：${image.cuisine} · ${image.tastes.join(' / ')}`,
    `- 主要食材：${image.mainIngredients.join('、')}`,
    `- 文件名：\`${image.filename}\` · 尺寸：${image.size}`,
    '',
    '```text',
    image.prompt,
    '```',
    '',
  ]),
  '## 5. 步骤图怎么办',
  '',
  '结论：**首版建议只替换成品图，步骤图继续保留当前的示意图**。',
  '',
  '原因：一道菜 4–6 步，25 道菜约 133 张；图像模型很难保证同一道菜在多个步骤里锅具、食材状态和光线一致，容易出现“步骤 3 的菜和成品不是同一道”的问题。当前项目的步骤图已经带编号和“示意图，非实拍”标注，是诚实的占位方案。',
  '',
  '如果仍想尝试，给 GPT 的步骤提示词模板：',
  '',
  '```text',
  'Realistic cooking-process photo for step {N} of {dish name}: {step title}. {step text}. Same kitchen, same cookware and ingredients as the finished dish, warm natural light, 3:2 landscape, no text, no watermark, no people, no hands. Keep the food consistency with the reference image.',
  '```',
  '',
  '生成后必须逐张人工核对：锅具、食材、火候、步骤顺序是否与文字一致；不一致就不要用。',
  '',
  '## 6. 拿到图片后怎么替换',
  '',
  '1. 把成品图缩放/裁切为 **1200×800 PNG**，命名为 `<菜谱 id>.png`；',
  '2. 覆盖到 `packages/content/images/recipes/`（先备份原示意图）；',
  '3. 修改对应菜谱 JSON 的 `image` 字段：',
  '   - AI 生成：保留 `kind: "illustration"`，`note` 改为 `"AI 生成示意图，非实拍"`，`credit` 写明模型与生成日期；',
   '   - 真实拍摄且拥有授权：改为 `kind: "photo"`，`credit` 写作者与许可；',
  '4. 执行 `npm run data:validate` 与 `npm run data:build`；',
  '5. 重新执行 `npm run build:static`，更新 GitHub Pages 的 `gh-pages` 分支。',
  '',
  '> ⚠️ 不要直接运行 `npm run data:images`：它会重新生成并**覆盖**你刚放进去的图片。替换真实/AI 图后，应跳过该脚本，或先备份。',
  '',
  '## 7. 合规与真实性',
  '',
  '- AI 生成图必须标注，不得作为“实拍”宣传；',
  '- 不要生成品牌 logo、名人肖像、受版权保护的角色；',
  '- 不要为了好看添加菜谱里没有的食材，尤其是过敏原；',
  '- 同一张图不能复用于多道菜；步骤图也不能复用成品图；',
  '- 正式上线前建议逐步替换为有明确授权的实拍图。',
  '',
  '## 8. 机器可读版本',
  '',
  '同目录的 `recipe-image-prompts.json` 包含同样的结构化提示词，方便脚本或 API 直接读取。',
  '',
  '## 9. 负面提示词',
  '',
  '```text',
  NEGATIVE,
  '```',
  '',
];

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(path.join(docsDir, 'recipe-image-handoff.md'), md.join('\n'), 'utf8');
fs.writeFileSync(
  path.join(docsDir, 'recipe-image-prompts.json'),
  `${JSON.stringify(jsonPayload, null, 2)}\n`,
  'utf8',
);

console.log(`✅ 已生成 docs/recipe-image-handoff.md`);
console.log(`✅ 已生成 docs/recipe-image-prompts.json（${images.length} 道菜）`);
