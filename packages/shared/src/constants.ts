import type { Cuisine, Difficulty, MealType, Preferences, TasteTag } from './types.js';

export const APP_NAME = '今天吃什么';
export const SCHEMA_VERSION = 1;
export const DEFAULT_TIMEZONE = 'Asia/Shanghai';
export const WEEK_LENGTH = 7;

export const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner'];

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
};

export const MEAL_EMOJI: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
};

export const MEAL_TIME_HINT: Record<MealType, string> = {
  breakfast: '07:00 - 09:00',
  lunch: '11:30 - 13:00',
  dinner: '17:30 - 19:30',
};

/** 每个餐次默认推荐的道数；午餐/晚餐可以有多道菜 */
export const SLOT_TARGETS: Record<MealType, number> = {
  breakfast: 1,
  lunch: 2,
  dinner: 2,
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  1: '简单',
  2: '中等',
  3: '进阶',
};

export const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  1: '新手也能一次成功',
  2: '需要一点火候经验',
  3: '步骤较多，适合周末',
};

export const CUISINES: Cuisine[] = [
  '家常菜',
  '川湘',
  '粤式',
  '江浙',
  '北方',
  '西式',
  '日韩',
  '轻食',
];

export const TASTE_TAGS: TasteTag[] = [
  '清淡',
  '咸鲜',
  '香辣',
  '酸甜',
  '酱香',
  '鲜香',
  '奶香',
  '微甜',
  '蒜香',
];

export const MAX_SERVINGS = 12;
export const MIN_SERVINGS = 1;

export const TIME_OPTIONS = [15, 20, 30, 45, 60, 90, 120];

export const STORAGE_KEYS = {
  preferences: 'dm.v1.preferences',
  favorites: 'dm.v1.favorites',
  menus: 'dm.v1.menus',
  shopping: 'dm.v1.shopping',
  meta: 'dm.v1.meta',
} as const;

export const DEFAULT_PREFERENCES: Preferences = {
  servings: 2,
  cuisines: [],
  tastes: [],
  avoidIngredients: [],
  allergens: [],
  dislikedIngredients: [],
  maxCookMinutes: 45,
  difficulties: [],
  timezone: DEFAULT_TIMEZONE,
  schemaVersion: SCHEMA_VERSION,
  updatedAt: '1970-01-01T00:00:00.000Z',
};

/** 常见忌口/过敏原快捷选项，减少用户输入成本 */
export const INGREDIENT_QUICK_OPTIONS = [
  '香菜',
  '葱',
  '蒜',
  '姜',
  '辣椒',
  '花椒',
  '花生',
  '坚果',
  '虾',
  '蟹',
  '贝类',
  '牛奶',
  '鸡蛋',
  '大豆',
  '麸质',
  '猪肉',
  '牛肉',
  '羊肉',
  '动物内脏',
  '鱼',
];

export const WEEKDAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
export const WEEKDAY_SHORT_LABELS = ['一', '二', '三', '四', '五', '六', '日'];
