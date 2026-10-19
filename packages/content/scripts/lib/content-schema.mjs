/**
 * 内容数据校验（纯 JS，供 CLI 脚本使用，避免依赖 TS 运行时）。
 * 规则与 docs/content-schema.md 保持一致。
 */
import fs from 'node:fs';
import path from 'node:path';

export const CUISINES = ['家常菜', '川湘', '粤式', '江浙', '北方', '西式', '日韩', '轻食'];
export const TASTES = ['清淡', '咸鲜', '香辣', '酸甜', '酱香', '鲜香', '奶香', '微甜', '蒜香'];
export const MEALS = ['breakfast', 'lunch', 'dinner'];
export const PLATFORMS = ['bilibili', 'douyin'];
export const VERIFICATION_STATUS = ['verified', 'link-broken', 'unverified'];
export const MATCH_BASIS = ['title-keyword', 'manual-review', 'platform-metadata'];
export const SOURCE_TYPES = ['original', 'curated', 'licensed', 'demo'];
export const IMAGE_KINDS = ['illustration', 'photo', 'placeholder'];
export const UNITS = [
  '克',
  'g',
  '毫升',
  'ml',
  '个',
  '只',
  '颗',
  '枚',
  '瓣',
  '根',
  '片',
  '块',
  '把',
  '张',
  '条',
  '段',
  '朵',
  '支',
  '盒',
  '袋',
  '听',
  '包',
  '勺',
  '汤匙',
  '茶匙',
  '小勺',
  '大勺',
];

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_TEXT = 400;

export function readJsonDirectory(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = fs
    .readdirSync(directory)
    .filter((name) => name.endsWith('.json'))
    .sort();
  return files.map((name) => {
    const fullPath = path.join(directory, name);
    const raw = fs.readFileSync(fullPath, 'utf8');
    let data;
    try {
      data = JSON.parse(raw);
    } catch (error) {
      throw new Error(`JSON 解析失败：${name} → ${error.message}`);
    }
    return { file: name, data };
  });
}

export function readJsonFile(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function checkImage(image, label, errors, expectedSrc) {
  if (!image || typeof image !== 'object') {
    errors.push(`${label} 缺少 image 对象`);
    return;
  }
  if (!isNonEmptyString(image.src)) errors.push(`${label} 缺少图片 src`);
  if (!isNonEmptyString(image.alt)) errors.push(`${label} 缺少图片 alt`);
  if (!IMAGE_KINDS.includes(image.kind)) errors.push(`${label} 的 image.kind 非法：${image.kind}`);
  if (!isNonEmptyString(image.credit)) errors.push(`${label} 缺少 image.credit`);
  if (image.kind === 'illustration' && image.note !== '示意图，非实拍') {
    errors.push(`${label} 是示意图，必须标注 note="示意图，非实拍"`);
  }
  if (expectedSrc && image.src !== expectedSrc) {
    errors.push(`${label} 图片路径应为 ${expectedSrc}，实际 ${image.src}`);
  }
}

export function validateRecipe(recipe, file) {
  const errors = [];
  const warnings = [];
  const at = (message) => errors.push(`[${file}] ${message}`);

  if (!recipe || typeof recipe !== 'object') {
    return { errors: [`[${file}] 不是对象`], warnings };
  }

  if (!isNonEmptyString(recipe.id) || !ID_PATTERN.test(recipe.id)) {
    at(`id 必须是小写英文/数字/连字符：${recipe.id}`);
  }
  if (file && isNonEmptyString(recipe.id) && file !== `${recipe.id}.json`) {
    at(`文件名应与 id 一致（期望 ${recipe.id}.json）`);
  }
  if (!isNonEmptyString(recipe.name)) at('缺少 name');
  if (!isNonEmptyString(recipe.subtitle)) at('缺少 subtitle');
  if (!isNonEmptyString(recipe.intro)) at('缺少 intro');
  else if (recipe.intro.length < 40) warnings.push(`[${file}] intro 偏短（${recipe.intro.length} 字）`);

  if (!CUISINES.includes(recipe.cuisine)) at(`cuisine 非法：${recipe.cuisine}`);
  if (!Array.isArray(recipe.tastes) || recipe.tastes.length === 0) at('tastes 至少一个');
  else {
    for (const taste of recipe.tastes) {
      if (!TASTES.includes(taste)) at(`taste 非法：${taste}`);
    }
  }
  if (!Array.isArray(recipe.mealTypes) || recipe.mealTypes.length === 0) at('mealTypes 至少一个');
  else {
    for (const meal of recipe.mealTypes) {
      if (!MEALS.includes(meal)) at(`mealType 非法：${meal}`);
    }
  }
  if (!isNumber(recipe.baseServings) || recipe.baseServings < 1 || recipe.baseServings > 8) {
    at('baseServings 应为 1–8');
  }
  if (!isNumber(recipe.prepMinutes) || recipe.prepMinutes < 1) at('prepMinutes 应 ≥ 1');
  if (!isNumber(recipe.cookMinutes) || recipe.cookMinutes < 1) at('cookMinutes 应 ≥ 1');
  if (![1, 2, 3].includes(recipe.difficulty)) at('difficulty 应为 1/2/3');

  checkImage(recipe.image, '成品图', errors, `/images/recipes/${recipe.id}.png`);

  if (!Array.isArray(recipe.mainIngredients) || recipe.mainIngredients.length < 1) {
    at('mainIngredients 至少一个');
  }
  if (!Array.isArray(recipe.allergenTags)) at('allergenTags 必须是数组（可为空）');

  if (!Array.isArray(recipe.ingredientGroups) || recipe.ingredientGroups.length !== 2) {
    at('ingredientGroups 必须正好包含 main 与 seasoning 两组');
  } else {
    const groupIds = recipe.ingredientGroups.map((group) => group.id).sort();
    if (groupIds.join(',') !== 'main,seasoning') at('ingredientGroups 只允许 main 与 seasoning');
    const itemIds = new Set();
    for (const group of recipe.ingredientGroups) {
      if (!isNonEmptyString(group.title)) at(`分组 ${group.id} 缺少 title`);
      if (!Array.isArray(group.items) || group.items.length === 0) {
        at(`分组 ${group.id} 没有食材`);
        continue;
      }
      for (const item of group.items) {
        if (!isNonEmptyString(item.id)) at(`分组 ${group.id} 存在缺少 id 的食材`);
        else if (itemIds.has(item.id)) at(`食材 id 重复：${item.id}`);
        else itemIds.add(item.id);
        if (!isNonEmptyString(item.name)) at(`食材 ${item.id} 缺少 name`);
        if (item.amount === null) {
          if (!isNonEmptyString(item.display)) at(`食材 ${item.id} amount 为 null 时必须提供 display`);
        } else if (!isNumber(item.amount) || item.amount <= 0) {
          at(`食材 ${item.id} amount 必须为正数或 null`);
        }
        if (typeof item.unit !== 'string') at(`食材 ${item.id} 缺少 unit（文字用量可为空字符串）`);
        if (typeof item.scalable !== 'boolean') at(`食材 ${item.id} scalable 必须是布尔值`);
        if (item.unit && !UNITS.includes(item.unit)) {
          warnings.push(`[${file}] 食材 ${item.name} 使用了非标准单位：${item.unit}`);
        }
      }
    }
  }

  if (!Array.isArray(recipe.steps) || recipe.steps.length < 4) {
    at('steps 至少 4 步');
  } else {
    const stepImages = new Set();
    recipe.steps.forEach((step, index) => {
      if (step.index !== index + 1) at(`步骤 index 应从 1 连续递增（第 ${index + 1} 步为 ${step.index}）`);
      if (!isNonEmptyString(step.title)) at(`步骤 ${index + 1} 缺少 title`);
      if (!isNonEmptyString(step.text)) at(`步骤 ${index + 1} 缺少 text`);
      else if (step.text.length < 20) warnings.push(`[${file}] 步骤 ${index + 1} 文字偏短`);
      checkImage(step.image, `步骤 ${index + 1}`, errors, `/images/recipes/${recipe.id}-step-${index + 1}.png`);
      if (step.image && stepImages.has(step.image.src)) {
        at(`步骤 ${index + 1} 复用了其他步骤的图片：${step.image.src}`);
      }
      if (step.image) stepImages.add(step.image.src);
      if (isNonEmptyString(step.text) && step.text.length > MAX_TEXT) {
        warnings.push(`[${file}] 步骤 ${index + 1} 文字过长`);
      }
    });
  }

  for (const field of ['tips', 'substitutions', 'failures']) {
    if (!Array.isArray(recipe[field]) || recipe[field].length === 0) at(`${field} 至少一条`);
    else if (recipe[field].some((item) => !isNonEmptyString(item))) at(`${field} 存在空内容`);
  }

  if (!recipe.source || !SOURCE_TYPES.includes(recipe.source.type)) {
    at('source.type 非法');
  } else {
    if (!isNonEmptyString(recipe.source.label)) at('source.label 缺失');
    if (recipe.source.type !== 'original' && !isNonEmptyString(recipe.source.url)) {
      warnings.push(`[${file}] 非原创来源建议提供 url`);
    }
  }

  if (!['complete', 'partial'].includes(recipe.completeness)) at('completeness 必须为 complete/partial');
  if (recipe.completeness === 'partial' && !isNonEmptyString(recipe.completenessNote)) {
    at('partial 内容必须提供 completenessNote');
  }
  for (const field of ['createdAt', 'updatedAt']) {
    if (!isNonEmptyString(recipe[field]) || Number.isNaN(Date.parse(recipe[field]))) {
      at(`${field} 必须是 ISO 时间字符串`);
    }
  }

  return { errors, warnings };
}

export function validateVideos(videos, recipes) {
  const errors = [];
  const warnings = [];
  const recipeIds = new Set(recipes.map((recipe) => recipe.id));
  const seen = new Set();

  for (const video of videos) {
    const label = `视频 ${video.id ?? '(unknown)'}`;
    const at = (message) => errors.push(`[${label}] ${message}`);
    if (!isNonEmptyString(video.id)) at('缺少 id');
    else if (seen.has(video.id)) at('id 重复');
    else seen.add(video.id);
    if (!PLATFORMS.includes(video.platform)) at(`platform 非法：${video.platform}`);
    if (!recipeIds.has(video.recipeId)) at(`recipeId 不存在：${video.recipeId}`);
    if (!isNonEmptyString(video.title)) at('缺少 title');
    if (!isNonEmptyString(video.author)) at('缺少 author');
    if (!isNonEmptyString(video.url) || !/^https?:\/\//.test(video.url)) at('url 非法');
    if (!isNonEmptyString(video.platformVideoId)) at('缺少 platformVideoId');
    if (video.platform === 'bilibili') {
      if (!video.url.includes(video.platformVideoId)) at('bilibili 链接与 platformVideoId 不一致');
      if (!/^BV[0-9A-Za-z]+$/.test(video.platformVideoId)) at('bilibili platformVideoId 应为 BV 号');
    }
    const verification = video.verification;
    if (!verification || !VERIFICATION_STATUS.includes(verification.status)) {
      at('verification.status 非法');
    } else {
      if (!MATCH_BASIS.includes(verification.matchBasis)) at('verification.matchBasis 非法');
      if (!isNonEmptyString(verification.method)) at('verification.method 缺失');
      if (verification.status === 'verified') {
        if (!isNonEmptyString(verification.checkedAt) || Number.isNaN(Date.parse(verification.checkedAt))) {
          at('已核验视频必须有合法的 checkedAt');
        }
      }
      if (verification.status === 'unverified' && verification.checkedAt !== null) {
        warnings.push(`[${label}] 未核验视频的 checkedAt 建议为 null`);
      }
    }
  }

  const verifiedCount = videos.filter((video) => video.verification?.status === 'verified').length;
  return { errors, warnings, stats: { total: videos.length, verified: verifiedCount } };
}

export function validateDataset(recipes, videos) {
  const errors = [];
  const warnings = [];
  const ids = new Set();

  for (const recipe of recipes) {
    if (ids.has(recipe.id)) errors.push(`菜谱 id 重复：${recipe.id}`);
    ids.add(recipe.id);
  }
  if (recipes.length === 0) errors.push('没有找到任何菜谱数据');

  const meals = { breakfast: 0, lunch: 0, dinner: 0 };
  for (const recipe of recipes) {
    for (const meal of recipe.mealTypes ?? []) {
      if (meal in meals) meals[meal] += 1;
    }
  }
  for (const [meal, count] of Object.entries(meals)) {
    if (count < 5) warnings.push(`${meal} 可选菜谱只有 ${count} 道，推荐多样性可能不足`);
  }

  const videoResult = validateVideos(videos, recipes);
  return {
    errors: [...errors, ...videoResult.errors],
    warnings: [...warnings, ...videoResult.warnings],
    stats: {
      recipes: recipes.length,
      meals,
      videos: videoResult.stats,
      cuisines: [...new Set(recipes.map((recipe) => recipe.cuisine))],
    },
  };
}
