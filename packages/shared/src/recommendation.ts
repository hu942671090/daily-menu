/**
 * 规则推荐引擎（rules-v1）
 *
 * 设计目标：
 * 1. 先满足硬约束：忌口 / 过敏原 / 不喜欢 / 餐次 / 可接受耗时 / 难度；
 * 2. 再考虑偏好：菜系、口味、时间宽裕度、多样性、食材复用；
 * 3. 完全可复现：同样的偏好 + 同样的周 + 同样的种子 → 同样的菜单；
 * 4. 可解释：每道菜给出推荐理由，便于用户理解并调整偏好。
 *
 * 后续接入智能推荐时，实现 RecommendationStrategy 并替换默认策略即可，
 * 页面与持久化层无需修改。
 */
import { DIFFICULTY_LABELS, MEAL_LABELS, MEAL_ORDER, SLOT_TARGETS } from './constants';
import { resolveTimeZone, startOfWeekMonday, weekDates } from './date';
import { createRandom } from './random';
import type {
  Cuisine,
  DishRecommendation,
  MealType,
  Preferences,
  Recipe,
  RecommendationInput,
  RecommendationResult,
  RecommendationStrategy,
  SlotRecommendation,
} from './types';

export interface WeekContext {
  recipeUse: Map<string, number>;
  ingredientUse: Map<string, number>;
  cuisineUse: Map<string, number>;
}

export interface SlotCandidate {
  recipe: Recipe;
  score: number;
  reasons: string[];
}

export interface RecipeCompliance {
  allowed: boolean;
  /** 硬性冲突：过敏原、忌口、不喜欢、超时、难度 */
  violations: string[];
  /** 正向匹配：偏好菜系、偏好口味 */
  highlights: string[];
}

export interface SlotFillOptions {
  recipes: Recipe[];
  preferences: Preferences;
  meal: MealType;
  count: number;
  /** 槽位内已存在的菜（通常是锁定的菜），不重复推荐 */
  existingRecipeIds?: string[];
  /** 本周其他槽位已用菜谱，用于去重与食材复用 */
  weekRecipes?: Recipe[];
  excludeRecipeIds?: string[];
  seed?: string;
}

export interface SlotFillResult {
  dishes: SlotCandidate[];
  relaxedNotes: string[];
  diagnostics: SlotDiagnostics;
}

export interface SlotDiagnostics {
  poolSize: number;
  excludedByIngredient: number;
  excludedByTime: number;
  excludedByDifficulty: number;
  excludedByMeal: number;
}

const BAN_SEPARATOR = /[、,，;；\s]+/;

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '');
}

export function totalMinutes(recipe: Recipe): number {
  return recipe.prepMinutes + recipe.cookMinutes;
}

export function recipeIngredientNames(recipe: Recipe): string[] {
  const names = new Set<string>();
  for (const name of recipe.mainIngredients) names.add(name);
  for (const group of recipe.ingredientGroups) {
    for (const item of group.items) names.add(item.name);
  }
  return [...names];
}

export function collectBannedIngredients(preferences: Preferences): string[] {
  const merged = [
    ...preferences.allergens,
    ...preferences.avoidIngredients,
    ...preferences.dislikedIngredients,
  ]
    .flatMap((entry) => entry.split(BAN_SEPARATOR))
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
  return [...new Set(merged)];
}

function matchedBans(recipe: Recipe, preferences: Preferences): string[] {
  const banned = collectBannedIngredients(preferences).map(normalize);
  if (banned.length === 0) return [];
  const haystack = [...recipeIngredientNames(recipe), ...recipe.allergenTags].map(normalize);
  return banned.filter((ban) => haystack.some((name) => name === ban || name.includes(ban)));
}

/**
 * 单道菜与偏好的匹配情况：用于菜谱卡片的「符合偏好 / 需注意」标记。
 */
export function evaluateRecipe(recipe: Recipe, preferences: Preferences): RecipeCompliance {
  const violations: string[] = [];
  const highlights: string[] = [];
  const bans = matchedBans(recipe, preferences);
  if (bans.length > 0) {
    violations.push(`含 ${bans.join('、')}`);
  }
  if (totalMinutes(recipe) > preferences.maxCookMinutes) {
    violations.push(`耗时 ${totalMinutes(recipe)} 分钟，超过可接受范围`);
  }
  if (preferences.difficulties.length > 0 && !preferences.difficulties.includes(recipe.difficulty)) {
    violations.push(`难度为「${DIFFICULTY_LABELS[recipe.difficulty]}」`);
  }
  if (preferences.cuisines.includes(recipe.cuisine)) {
    highlights.push(`符合「${recipe.cuisine}」偏好`);
  }
  const tasteHits = recipe.tastes.filter((taste) => preferences.tastes.includes(taste));
  if (tasteHits.length > 0) {
    highlights.push(`口味 ${tasteHits.join('、')} 对味`);
  }
  return { allowed: violations.length === 0, violations, highlights };
}

export function createWeekContext(): WeekContext {
  return {
    recipeUse: new Map(),
    ingredientUse: new Map(),
    cuisineUse: new Map(),
  };
}

export function addRecipeToContext(context: WeekContext, recipe: Recipe): void {
  context.recipeUse.set(recipe.id, (context.recipeUse.get(recipe.id) ?? 0) + 1);
  context.cuisineUse.set(recipe.cuisine, (context.cuisineUse.get(recipe.cuisine) ?? 0) + 1);
  for (const ingredient of recipe.mainIngredients) {
    const key = normalize(ingredient);
    context.ingredientUse.set(key, (context.ingredientUse.get(key) ?? 0) + 1);
  }
}

export function buildWeekContext(recipes: Recipe[]): WeekContext {
  const context = createWeekContext();
  for (const recipe of recipes) addRecipeToContext(context, recipe);
  return context;
}

function timeScore(recipe: Recipe, preferences: Preferences): number {
  const max = Math.max(1, preferences.maxCookMinutes);
  const ratio = Math.min(1, totalMinutes(recipe) / max);
  return Math.max(0, 10 * (1 - ratio));
}

function isTimeAcceptable(recipe: Recipe, preferences: Preferences): boolean {
  return totalMinutes(recipe) <= preferences.maxCookMinutes;
}

function isDifficultyAcceptable(recipe: Recipe, preferences: Preferences): boolean {
  return preferences.difficulties.length === 0 || preferences.difficulties.includes(recipe.difficulty);
}

interface ScoreResult {
  score: number;
  reasons: string[];
}

function scoreRecipe(
  recipe: Recipe,
  preferences: Preferences,
  meal: MealType,
  context: WeekContext,
  slotRecipes: Recipe[],
  seed: string,
): ScoreResult {
  const reasons: string[] = [];
  let score = 40;

  if (preferences.cuisines.includes(recipe.cuisine)) {
    score += 22;
    reasons.push(`符合「${recipe.cuisine}」偏好`);
  }

  const tasteHits = recipe.tastes.filter((taste) => preferences.tastes.includes(taste)).slice(0, 2);
  if (tasteHits.length > 0) {
    score += tasteHits.length * 9;
    reasons.push(`口味${tasteHits.join('、')}对味`);
  }

  score += timeScore(recipe, preferences);
  if (isTimeAcceptable(recipe, preferences)) {
    reasons.push(`${totalMinutes(recipe)} 分钟可完成`);
  }

  if (preferences.difficulties.includes(recipe.difficulty)) {
    score += 5;
    if (recipe.difficulty === 1) reasons.push('步骤简单，新手也稳');
  }

  const reuseNames: string[] = [];
  for (const ingredient of recipe.mainIngredients.slice(0, 4)) {
    if ((context.ingredientUse.get(normalize(ingredient)) ?? 0) > 0) reuseNames.push(ingredient);
  }
  if (reuseNames.length > 0) {
    score += Math.min(9, reuseNames.length * 3);
    reasons.push(`复用${reuseNames.slice(0, 2).join('、')}，方便一次采购`);
  }

  const usedCount = context.recipeUse.get(recipe.id) ?? 0;
  score -= usedCount * 45;

  const cuisineCount = context.cuisineUse.get(recipe.cuisine) ?? 0;
  score -= Math.min(21, cuisineCount * 7);

  for (const other of slotRecipes) {
    const overlap = recipe.mainIngredients.filter((ingredient) =>
      other.mainIngredients.includes(ingredient),
    );
    score -= overlap.length * 6;
  }

  if (usedCount === 0) {
    reasons.push('本周还没安排过，换换口味');
  }

  const jitter = createRandom(`${seed}|${recipe.id}`)() * 5;
  score += jitter;

  return { score: Math.round(score * 10) / 10, reasons: reasons.slice(0, 4) };
}

interface SlotPools {
  base: Recipe[];
  primary: Recipe[];
  timeRelaxed: Recipe[];
  difficultyRelaxed: Recipe[];
  allRelaxed: Recipe[];
  diagnostics: SlotDiagnostics;
}

function buildSlotPools(
  recipes: Recipe[],
  preferences: Preferences,
  meal: MealType,
  excludeIds: Set<string>,
): SlotPools {
  const base: Recipe[] = [];
  let excludedByIngredient = 0;
  let excludedByMeal = 0;

  for (const recipe of recipes) {
    if (excludeIds.has(recipe.id)) continue;
    if (!recipe.mealTypes.includes(meal)) {
      excludedByMeal += 1;
      continue;
    }
    if (matchedBans(recipe, preferences).length > 0) {
      excludedByIngredient += 1;
      continue;
    }
    base.push(recipe);
  }

  const primary = base.filter(
    (recipe) => isTimeAcceptable(recipe, preferences) && isDifficultyAcceptable(recipe, preferences),
  );
  const timeRelaxed = base.filter(
    (recipe) =>
      !isTimeAcceptable(recipe, preferences) &&
      isDifficultyAcceptable(recipe, preferences) &&
      totalMinutes(recipe) <= preferences.maxCookMinutes * 1.5,
  );
  const difficultyRelaxed = base.filter(
    (recipe) => isTimeAcceptable(recipe, preferences) && !isDifficultyAcceptable(recipe, preferences),
  );
  const allRelaxed = base.filter(
    (recipe) =>
      !isTimeAcceptable(recipe, preferences) && !isDifficultyAcceptable(recipe, preferences),
  );

  return {
    base,
    primary,
    timeRelaxed,
    difficultyRelaxed,
    allRelaxed,
    diagnostics: {
      poolSize: base.length,
      excludedByIngredient,
      excludedByTime: timeRelaxed.length + allRelaxed.length,
      excludedByDifficulty: difficultyRelaxed.length + allRelaxed.length,
      excludedByMeal,
    },
  };
}

function rankCandidates(
  candidates: Recipe[],
  preferences: Preferences,
  meal: MealType,
  context: WeekContext,
  slotRecipes: Recipe[],
  usedInSlot: Set<string>,
  excludeIds: Set<string>,
  seed: string,
): SlotCandidate[] {
  const available = candidates.filter(
    (recipe) => !usedInSlot.has(recipe.id) && !excludeIds.has(recipe.id),
  );
  if (available.length === 0) return [];
  const fresh = available.filter((recipe) => (context.recipeUse.get(recipe.id) ?? 0) === 0);
  const pool = fresh.length > 0 ? fresh : available;
  return pool
    .map((recipe) => {
      const scored = scoreRecipe(recipe, preferences, meal, context, slotRecipes, seed);
      return { recipe, score: scored.score, reasons: scored.reasons };
    })
    .sort((left, right) => right.score - left.score || left.recipe.id.localeCompare(right.recipe.id));
}

/** 填充单个餐次槽位，供整周生成与「换一道 / 重新生成某一餐」复用 */
export function fillSlot(options: SlotFillOptions): SlotFillResult {
  const {
    recipes,
    preferences,
    meal,
    count,
    existingRecipeIds = [],
    weekRecipes = [],
    excludeRecipeIds = [],
    seed = 'default',
  } = options;

  const excludeIds = new Set(excludeRecipeIds);
  const context = buildWeekContext(weekRecipes);
  const existing = recipes.filter((recipe) => existingRecipeIds.includes(recipe.id));
  for (const recipe of existing) addRecipeToContext(context, recipe);

  const slotRecipes: Recipe[] = [...existing];
  const usedInSlot = new Set<string>(existingRecipeIds);
  const pools = buildSlotPools(recipes, preferences, meal, excludeIds);
  const relaxedNotes: string[] = [];
  const dishes: SlotCandidate[] = [];

  const tiers: Array<{ list: Recipe[]; note?: string }> = [
    { list: pools.primary },
    { list: pools.difficultyRelaxed, note: '已放宽难度偏好' },
    {
      list: pools.timeRelaxed,
      note: `已放宽耗时到 ${Math.round(preferences.maxCookMinutes * 1.5)} 分钟`,
    },
    { list: pools.allRelaxed, note: '已同时放宽耗时与难度，请留意烹饪时间' },
  ];

  for (let index = 0; index < count; index += 1) {
    let picked: SlotCandidate | undefined;
    let usedTier = '';
    for (const tier of tiers) {
      const ranked = rankCandidates(
        tier.list,
        preferences,
        meal,
        context,
        slotRecipes,
        usedInSlot,
        excludeIds,
        seed,
      );
      if (ranked.length > 0) {
        picked = ranked[0];
        usedTier = tier.note ?? '';
        break;
      }
    }
    if (!picked) break;
    if (usedTier && !relaxedNotes.includes(usedTier)) relaxedNotes.push(usedTier);
    dishes.push(picked);
    usedInSlot.add(picked.recipe.id);
    slotRecipes.push(picked.recipe);
    addRecipeToContext(context, picked.recipe);
  }

  if (dishes.length < count) {
    const note = `${MEAL_LABELS[meal]}可选菜谱不足，已推荐 ${dishes.length} / ${count} 道`;
    if (!relaxedNotes.includes(note)) relaxedNotes.push(note);
  }

  return { dishes, relaxedNotes, diagnostics: pools.diagnostics };
}

function emptyDiagnostics(): SlotDiagnostics {
  return {
    poolSize: 0,
    excludedByIngredient: 0,
    excludedByTime: 0,
    excludedByDifficulty: 0,
    excludedByMeal: 0,
  };
}

export function recommendWeek(input: RecommendationInput): RecommendationResult {
  const timezone = resolveTimeZone(input.timezone);
  const weekStart = startOfWeekMonday(input.weekStart);
  const seed = input.seed ?? `week:${weekStart}:${input.preferences.updatedAt}`;
  const recipesById = new Map(input.recipes.map((recipe) => [recipe.id, recipe]));
  const preused = (input.preusedRecipeIds ?? [])
    .map((id) => recipesById.get(id))
    .filter((recipe): recipe is Recipe => Boolean(recipe));

  const context = buildWeekContext(preused);
  const excluded = new Set(input.excludeRecipeIds ?? []);
  const slots: SlotRecommendation[] = [];
  const relaxed: string[] = [];

  for (const date of weekDates(weekStart)) {
    for (const meal of MEAL_ORDER) {
      const key = `${date}:${meal}`;
      const quota = input.slotQuotas?.[key] ?? SLOT_TARGETS[meal];
      if (quota <= 0) {
        slots.push({ date, meal, dishes: [], relaxedNotes: [] });
        continue;
      }

      const result = fillSlot({
        recipes: input.recipes,
        preferences: input.preferences,
        meal,
        count: quota,
        weekRecipes: contextToRecipes(context, input.recipes),
        excludeRecipeIds: [...excluded],
        seed: `${seed}|${key}`,
      });

      for (const note of result.relaxedNotes) {
        if (!relaxed.includes(note)) relaxed.push(note);
      }
      for (const dish of result.dishes) addRecipeToContext(context, dish.recipe);
      slots.push({ date, meal, dishes: result.dishes, relaxedNotes: result.relaxedNotes });
    }
  }

  const usableRecipes = new Set(slots.flatMap((slot) => slot.dishes.map((dish) => dish.recipe.id)));
  const diagnostics = summarizeDiagnostics(input.recipes, input.preferences, excluded);

  return {
    weekStart,
    timezone,
    strategy: 'rules-v1',
    slots,
    diagnostics: {
      ...diagnostics,
      totalRecipes: input.recipes.length,
      usableRecipes: usableRecipes.size,
      relaxed,
    },
  };
}

function summarizeDiagnostics(
  recipes: Recipe[],
  preferences: Preferences,
  excluded: Set<string>,
): Omit<RecommendationResult['diagnostics'], 'totalRecipes' | 'usableRecipes' | 'relaxed'> {
  const considered = recipes.filter((recipe) => !excluded.has(recipe.id));
  const byMeal = considered.filter((recipe) =>
    MEAL_ORDER.some((meal) => recipe.mealTypes.includes(meal)),
  );
  const usable = byMeal.filter((recipe) => matchedBans(recipe, preferences).length === 0);
  const timeExcluded = usable.filter((recipe) => !isTimeAcceptable(recipe, preferences)).length;
  const difficultyExcluded = usable.filter(
    (recipe) => !isDifficultyAcceptable(recipe, preferences),
  ).length;
  return {
    excludedByIngredient: byMeal.length - usable.length,
    excludedByTime: timeExcluded,
    excludedByDifficulty: difficultyExcluded,
    excludedByMeal: considered.length - byMeal.length,
  };
}

function countExcludedByIngredient(
  recipes: Recipe[],
  preferences: Preferences,
  excluded: Set<string>,
): number {
  return recipes.filter(
    (recipe) => !excluded.has(recipe.id) && matchedBans(recipe, preferences).length > 0,
  ).length;
}

function contextToRecipes(context: WeekContext, recipes: Recipe[]): Recipe[] {
  const result: Recipe[] = [];
  for (const [id, count] of context.recipeUse) {
    const recipe = recipes.find((item) => item.id === id);
    if (!recipe) continue;
    for (let index = 0; index < count; index += 1) result.push(recipe);
  }
  return result;
}

export const rulesStrategy: RecommendationStrategy = {
  id: 'rules-v1',
  label: '规则推荐 v1',
  description: '按忌口、耗时、口味、多样性与食材复用打分，结果可解释且可复现。',
  recommend: recommendWeek,
};

const strategies = new Map<string, RecommendationStrategy>([[rulesStrategy.id, rulesStrategy]]);

export function registerStrategy(strategy: RecommendationStrategy): void {
  strategies.set(strategy.id, strategy);
}

export function getStrategy(id: string): RecommendationStrategy | undefined {
  return strategies.get(id);
}

export function listStrategies(): RecommendationStrategy[] {
  return [...strategies.values()];
}

export function recommendWithStrategy(
  strategyId: string,
  input: RecommendationInput,
): RecommendationResult {
  const strategy = strategies.get(strategyId) ?? rulesStrategy;
  return strategy.recommend(input);
}

/** 统计菜系分布，用于菜单概览 */
export function cuisineDistribution(recipes: Recipe[]): Array<{ cuisine: Cuisine; count: number }> {
  const counts = new Map<Cuisine, number>();
  for (const recipe of recipes) {
    counts.set(recipe.cuisine, (counts.get(recipe.cuisine) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([cuisine, count]) => ({ cuisine, count }))
    .sort((left, right) => right.count - left.count);
}
