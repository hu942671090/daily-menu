import type { Cuisine, Difficulty, ImageRef, IngredientItem, MealType, Recipe, TasteTag } from '../src/types';

const illustration = (id: string, suffix = ''): ImageRef => ({
  src: `/images/recipes/${id}${suffix}.png`,
  alt: `${id}${suffix}`,
  kind: 'illustration',
  credit: '测试示意图',
  note: '示意图，非实拍',
});

function item(id: string, name: string, amount: number | null, unit = '克'): IngredientItem {
  return {
    id,
    name,
    amount,
    unit,
    scalable: amount !== null,
    ...(amount === null ? { display: '少许' } : {}),
  };
}

export interface RecipeSeed {
  id: string;
  name: string;
  cuisine?: Cuisine;
  tastes?: TasteTag[];
  mealTypes?: MealType[];
  baseServings?: number;
  prepMinutes?: number;
  cookMinutes?: number;
  difficulty?: Difficulty;
  mainIngredients: string[];
  allergenTags?: string[];
}

export function makeRecipe(seed: RecipeSeed): Recipe {
  return {
    id: seed.id,
    name: seed.name,
    subtitle: `${seed.name}的测试简介`,
    intro: `${seed.name}是一道用于测试的示例菜谱，文字长度足够用于校验界面展示效果。`,
    cuisine: seed.cuisine ?? '家常菜',
    tastes: seed.tastes ?? ['咸鲜'],
    mealTypes: seed.mealTypes ?? ['lunch', 'dinner'],
    baseServings: seed.baseServings ?? 2,
    prepMinutes: seed.prepMinutes ?? 5,
    cookMinutes: seed.cookMinutes ?? 10,
    difficulty: seed.difficulty ?? 1,
    image: illustration(seed.id),
    mainIngredients: seed.mainIngredients,
    allergenTags: seed.allergenTags ?? [],
    ingredientGroups: [
      {
        id: 'main',
        title: '主料',
        items: seed.mainIngredients.map((name, index) => item(`${seed.id}-main-${index}`, name, 200)),
      },
      {
        id: 'seasoning',
        title: '调料',
        items: [item(`${seed.id}-salt`, '盐', null, '')],
      },
    ],
    steps: [1, 2, 3, 4].map((index) => ({
      index,
      title: `第 ${index} 步`,
      text: `这是第 ${index} 步的测试操作说明，用于验证步骤图片与编号是否一一对应。`,
      image: illustration(seed.id, `-step-${index}`),
      heat: '中火',
      timeHint: '约 1 分钟',
    })),
    tips: ['测试提示一', '测试提示二'],
    substitutions: ['测试替换说明'],
    failures: ['测试失败说明'],
    source: { type: 'original', label: '测试数据', license: 'CC0' },
    completeness: 'complete',
    createdAt: '2026-10-19T00:00:00.000Z',
    updatedAt: '2026-10-19T00:00:00.000Z',
  };
}

export const TEST_RECIPES: Recipe[] = [
  makeRecipe({
    id: 'tomato-egg',
    name: '番茄炒蛋',
    mealTypes: ['lunch', 'dinner'],
    prepMinutes: 8,
    cookMinutes: 7,
    difficulty: 1,
    mainIngredients: ['番茄', '鸡蛋'],
    allergenTags: ['鸡蛋'],
  }),
  makeRecipe({
    id: 'pepper-pork',
    name: '青椒肉丝',
    tastes: ['咸鲜', '微甜'],
    prepMinutes: 10,
    cookMinutes: 15,
    difficulty: 2,
    mainIngredients: ['青椒', '猪肉'],
    allergenTags: ['猪肉'],
  }),
  makeRecipe({
    id: 'garlic-broccoli',
    name: '蒜蓉西兰花',
    tastes: ['清淡', '蒜香'],
    prepMinutes: 5,
    cookMinutes: 5,
    difficulty: 1,
    mainIngredients: ['西兰花'],
  }),
  makeRecipe({
    id: 'millet-porridge',
    name: '小米南瓜粥',
    tastes: ['清淡', '微甜'],
    mealTypes: ['breakfast'],
    prepMinutes: 5,
    cookMinutes: 15,
    difficulty: 1,
    mainIngredients: ['小米', '南瓜'],
  }),
  makeRecipe({
    id: 'curry-chicken',
    name: '咖喱鸡',
    cuisine: '日韩',
    tastes: ['咸鲜', '微甜'],
    mealTypes: ['dinner'],
    prepMinutes: 15,
    cookMinutes: 25,
    difficulty: 2,
    mainIngredients: ['鸡肉', '土豆'],
    allergenTags: ['鸡肉'],
  }),
  makeRecipe({
    id: 'cold-cucumber',
    name: '凉拌黄瓜',
    cuisine: '轻食',
    tastes: ['清淡', '蒜香'],
    prepMinutes: 5,
    cookMinutes: 3,
    difficulty: 1,
    mainIngredients: ['黄瓜', '大蒜'],
  }),
  makeRecipe({
    id: 'braised-pork',
    name: '红烧肉',
    tastes: ['酱香', '微甜'],
    mealTypes: ['dinner'],
    prepMinutes: 15,
    cookMinutes: 75,
    difficulty: 3,
    mainIngredients: ['猪肉'],
    allergenTags: ['猪肉'],
  }),
  makeRecipe({
    id: 'peanut-porridge',
    name: '花生粥',
    tastes: ['微甜'],
    mealTypes: ['breakfast'],
    prepMinutes: 5,
    cookMinutes: 20,
    difficulty: 1,
    mainIngredients: ['花生', '大米'],
    allergenTags: ['花生'],
  }),
];
