/**
 * 内容数据访问层：页面不直接 import JSON，只通过这里取数，
 * 后续切换 API / CMS / 数据库时只需替换本模块的实现。
 */
import type { Cuisine, Difficulty, MealType, Recipe, RecipeVideo, VideoPlatform } from '@daily-menu/shared';
import { DATASET_META, RECIPES, VIDEOS } from './generated/dataset';

export { DATASET_META, RECIPES, VIDEOS };

export interface RecipeQuery {
  q?: string;
  meals?: MealType[];
  cuisines?: Cuisine[];
  tastes?: string[];
  /** 最长总耗时（准备 + 烹饪），分钟 */
  maxMinutes?: number;
  difficulties?: Difficulty[];
  hasVideo?: boolean;
  excludeIds?: string[];
  limit?: number;
}

export interface VideoSearchLink {
  platform: VideoPlatform;
  label: string;
  url: string;
  /** 明确说明这是搜索页，不是已匹配的教程 */
  note: string;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function recipeSearchText(recipe: Recipe): string {
  const ingredients = recipe.ingredientGroups.flatMap((group) => group.items.map((item) => item.name));
  return normalize([recipe.name, recipe.subtitle, recipe.intro, ...recipe.mainIngredients, ...ingredients].join(' '));
}

export function searchRecipes(
  query: RecipeQuery = {},
  recipes: Recipe[] = RECIPES,
  videos: RecipeVideo[] = VIDEOS,
): Recipe[] {
  const keyword = query.q ? normalize(query.q) : '';
  const verifiedRecipeIds = new Set(
    videos.filter((video) => video.verification.status === 'verified').map((video) => video.recipeId),
  );
  const excluded = new Set(query.excludeIds ?? []);

  const scored: Array<{ recipe: Recipe; score: number }> = [];
  for (const recipe of recipes) {
    if (excluded.has(recipe.id)) continue;
    if (query.meals && query.meals.length > 0) {
      if (!recipe.mealTypes.some((meal) => query.meals?.includes(meal))) continue;
    }
    if (query.cuisines && query.cuisines.length > 0 && !query.cuisines.includes(recipe.cuisine)) continue;
    if (query.tastes && query.tastes.length > 0) {
      if (!recipe.tastes.some((taste) => query.tastes?.includes(taste))) continue;
    }
    if (query.maxMinutes && recipe.prepMinutes + recipe.cookMinutes > query.maxMinutes) continue;
    if (query.difficulties && query.difficulties.length > 0) {
      if (!query.difficulties.includes(recipe.difficulty)) continue;
    }
    if (query.hasVideo && !verifiedRecipeIds.has(recipe.id)) continue;

    let score = 1;
    if (keyword) {
      const name = normalize(recipe.name);
      if (name === keyword) score += 120;
      else if (name.includes(keyword)) score += 80;
      for (const ingredient of recipe.mainIngredients) {
        if (normalize(ingredient).includes(keyword)) score += 30;
      }
      if (recipeSearchText(recipe).includes(keyword)) score += 12;
      if (score === 1) continue;
    }
    scored.push({ recipe, score });
  }

  scored.sort((left, right) => right.score - left.score || left.recipe.name.localeCompare(right.recipe.name, 'zh-Hans-CN'));
  const limited = typeof query.limit === 'number' ? scored.slice(0, query.limit) : scored;
  return limited.map((entry) => entry.recipe);
}

export function getRecipeById(id: string, recipes: Recipe[] = RECIPES): Recipe | undefined {
  return recipes.find((recipe) => recipe.id === id);
}

export function getRecipesByMeal(meal: MealType, recipes: Recipe[] = RECIPES): Recipe[] {
  return recipes.filter((recipe) => recipe.mealTypes.includes(meal));
}

export function getVideosForRecipe(
  recipeId: string,
  videos: RecipeVideo[] = VIDEOS,
): RecipeVideo[] {
  const statusWeight: Record<string, number> = { verified: 0, 'link-broken': 1, unverified: 2 };
  return videos
    .filter((video) => video.recipeId === recipeId)
    .sort(
      (left, right) =>
        (statusWeight[left.verification.status] ?? 9) - (statusWeight[right.verification.status] ?? 9) ||
        (right.durationSec ?? 0) - (left.durationSec ?? 0),
    );
}

export function getVerifiedVideos(videos: RecipeVideo[] = VIDEOS): RecipeVideo[] {
  return videos.filter((video) => video.verification.status === 'verified');
}

export function getVideoById(id: string, videos: RecipeVideo[] = VIDEOS): RecipeVideo | undefined {
  return videos.find((video) => video.id === id);
}

export function hasVerifiedVideo(recipeId: string, videos: RecipeVideo[] = VIDEOS): boolean {
  return videos.some(
    (video) => video.recipeId === recipeId && video.verification.status === 'verified',
  );
}

export function getRelatedRecipes(
  recipe: Recipe,
  limit = 3,
  recipes: Recipe[] = RECIPES,
): Recipe[] {
  const scored = recipes
    .filter((candidate) => candidate.id !== recipe.id)
    .map((candidate) => {
      let score = 0;
      if (candidate.cuisine === recipe.cuisine) score += 10;
      for (const ingredient of recipe.mainIngredients) {
        if (candidate.mainIngredients.includes(ingredient)) score += 6;
      }
      for (const taste of recipe.tastes) {
        if (candidate.tastes.includes(taste)) score += 2;
      }
      if (candidate.mealTypes.some((meal) => recipe.mealTypes.includes(meal))) score += 1;
      return { candidate, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.candidate.name.localeCompare(right.candidate.name, 'zh-Hans-CN'));
  return scored.slice(0, limit).map((entry) => entry.candidate);
}

/** 平台搜索入口：与「已核验视频」严格区分 */
export function getVideoSearchLinks(recipe: Recipe): VideoSearchLink[] {
  const keyword = encodeURIComponent(`${recipe.name} 做法`);
  return [
    {
      platform: 'bilibili',
      label: '在 bilibili 搜索相关教程',
      url: `https://search.bilibili.com/all?keyword=${keyword}`,
      note: '打开的是平台搜索结果页，并非已匹配的视频',
    },
    {
      platform: 'douyin',
      label: '在抖音搜索相关教程',
      url: `https://www.douyin.com/search/${keyword}`,
      note: '打开的是平台搜索结果页，并非已匹配的视频',
    },
  ];
}

export interface ContentStats {
  recipeCount: number;
  videoCount: number;
  verifiedVideoCount: number;
  recipesWithVerifiedVideo: number;
  byMeal: Record<MealType, number>;
  byCuisine: Array<{ cuisine: Cuisine; count: number }>;
}

export function getContentStats(recipes: Recipe[] = RECIPES, videos: RecipeVideo[] = VIDEOS): ContentStats {
  const verified = getVerifiedVideos(videos);
  const byMeal: Record<MealType, number> = { breakfast: 0, lunch: 0, dinner: 0 };
  for (const recipe of recipes) {
    for (const meal of recipe.mealTypes) byMeal[meal] += 1;
  }
  const cuisineCounts = new Map<Cuisine, number>();
  for (const recipe of recipes) {
    cuisineCounts.set(recipe.cuisine, (cuisineCounts.get(recipe.cuisine) ?? 0) + 1);
  }
  return {
    recipeCount: recipes.length,
    videoCount: videos.length,
    verifiedVideoCount: verified.length,
    recipesWithVerifiedVideo: new Set(verified.map((video) => video.recipeId)).size,
    byMeal,
    byCuisine: [...cuisineCounts.entries()]
      .map(([cuisine, count]) => ({ cuisine, count }))
      .sort((left, right) => right.count - left.count),
  };
}

export function formatVideoDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return '时长未知';
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes < 1) return `${rest} 秒`;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
}
