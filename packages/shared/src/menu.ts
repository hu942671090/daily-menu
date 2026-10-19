/**
 * 每周菜单的应用层操作：生成、替换、锁定、重生成、保存。
 *
 * 所有函数都是纯函数（不读写存储），返回新的 WeekMenu，便于 Web / 小程序复用与测试。
 */
import { MEAL_ORDER, SLOT_TARGETS } from './constants';
import {
  addDays,
  assertDateString,
  startOfWeekMonday,
  todayInTimeZone,
  weekDates,
  weekKey,
} from './date';
import { fillSlot, recommendWeek, totalMinutes } from './recommendation';
import type {
  DayMenu,
  DishRecommendation,
  MealType,
  MenuDish,
  Preferences,
  Recipe,
  WeekMenu,
} from './types';

export interface CreateWeekMenuInput {
  weekStart: string;
  preferences: Preferences;
  recipes: Recipe[];
  timezone?: string;
  seed?: string;
  /** 用户锁定的菜：`${date}:${meal}` -> recipeId[] */
  lockedRecipeIds?: Record<string, string[]>;
  now?: Date;
  strategy?: string;
}

export interface MenuActionOptions {
  recipes: Recipe[];
  preferences: Preferences;
  now?: Date;
  seed?: string;
  /** 用于「换一道」时排除当前菜 */
  excludeRecipeIds?: string[];
}

function nowIso(now?: Date): string {
  return (now ?? new Date()).toISOString();
}

function timestampId(now?: Date): string {
  return (now ?? new Date()).getTime().toString(36);
}

function menuId(weekStart: string, timezone: string): string {
  return `menu:${timezone}:${weekStart}`;
}

function emptyMeals(): Record<MealType, MenuDish[]> {
  return { breakfast: [], lunch: [], dinner: [] };
}

function clonePreferences(preferences: Preferences): Preferences {
  return {
    ...preferences,
    cuisines: [...preferences.cuisines],
    tastes: [...preferences.tastes],
    avoidIngredients: [...preferences.avoidIngredients],
    allergens: [...preferences.allergens],
    dislikedIngredients: [...preferences.dislikedIngredients],
    difficulties: [...preferences.difficulties],
  };
}

function toMenuDish(
  recipeId: string,
  locked: boolean,
  origin: MenuDish['origin'],
  now?: Date,
  reasons?: string[],
): MenuDish {
  const dish: MenuDish = { recipeId, locked, origin, addedAt: nowIso(now) };
  if (reasons && reasons.length > 0) dish.reasons = reasons.slice(0, 4);
  return dish;
}

export function slotTarget(meal: MealType): number {
  return SLOT_TARGETS[meal];
}

export function slotKey(date: string, meal: MealType): string {
  return `${date}:${meal}`;
}

function collectLocked(
  weekStart: string,
  locked: Record<string, string[]>,
): Record<string, MenuDish[]> {
  const result: Record<string, MenuDish[]> = {};
  for (const date of weekDates(weekStart)) {
    for (const meal of MEAL_ORDER) {
      const key = slotKey(date, meal);
      const ids = locked[key] ?? [];
      if (ids.length === 0) continue;
      result[key] = ids.map((recipeId) => toMenuDish(recipeId, true, 'manual'));
    }
  }
  return result;
}

/**
 * 根据偏好生成本周菜单：锁定的菜原样保留，其余按推荐规则生成。
 * 相同偏好 + 相同周 + 相同种子，结果完全一致。
 */
export function createWeekMenu(input: CreateWeekMenuInput): WeekMenu {
  const weekStart = startOfWeekMonday(input.weekStart);
  const timezone = input.timezone ?? input.preferences.timezone;
  const now = input.now ?? new Date();
  const locked = input.lockedRecipeIds ?? {};
  const lockedDishes = collectLocked(weekStart, locked);
  const lockedIds = Object.values(lockedDishes)
    .flat()
    .map((dish) => dish.recipeId);

  const slotQuotas: Record<string, number> = {};
  for (const date of weekDates(weekStart)) {
    for (const meal of MEAL_ORDER) {
      const key = slotKey(date, meal);
      const lockedCount = lockedDishes[key]?.length ?? 0;
      slotQuotas[key] = Math.max(0, SLOT_TARGETS[meal] - lockedCount);
    }
  }

  const result = recommendWeek({
    recipes: input.recipes,
    preferences: input.preferences,
    weekStart,
    timezone,
    seed: input.seed ?? `${weekKey(weekStart, timezone)}|${input.preferences.updatedAt}`,
    preusedRecipeIds: lockedIds,
    slotQuotas,
  });

  const bySlot = new Map(result.slots.map((slot) => [slotKey(slot.date, slot.meal), slot]));
  const days: DayMenu[] = weekDates(weekStart).map((date) => {
    const meals = emptyMeals();
    for (const meal of MEAL_ORDER) {
      const key = slotKey(date, meal);
      const kept = lockedDishes[key] ?? [];
      const generated = (bySlot.get(key)?.dishes ?? []).map((dish) =>
        toMenuDish(dish.recipe.id, false, 'generated', now, dish.reasons),
      );
      meals[meal] = dedupeDishes([...kept, ...generated]);
    }
    return { date, meals };
  });

  return {
    id: menuId(weekStart, timezone),
    weekStart,
    timezone,
    days,
    strategy: input.strategy ?? result.strategy,
    preferences: clonePreferences(input.preferences),
    generatedAt: nowIso(now),
    updatedAt: nowIso(now),
    schemaVersion: 1,
  };
}

function dedupeDishes(dishes: MenuDish[]): MenuDish[] {
  const seen = new Set<string>();
  const result: MenuDish[] = [];
  for (const dish of dishes) {
    if (seen.has(dish.recipeId)) continue;
    seen.add(dish.recipeId);
    result.push(dish);
  }
  return result;
}

export function getDay(menu: WeekMenu, date: string): DayMenu | undefined {
  return menu.days.find((day) => day.date === date);
}

export function getRecipesInMenu(menu: WeekMenu, recipes: Recipe[]): Recipe[] {
  const byId = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const result: Recipe[] = [];
  for (const day of menu.days) {
    for (const meal of MEAL_ORDER) {
      for (const dish of day.meals[meal]) {
        const recipe = byId.get(dish.recipeId);
        if (recipe) result.push(recipe);
      }
    }
  }
  return result;
}

export function getUniqueRecipes(menu: WeekMenu, recipes: Recipe[]): Recipe[] {
  const seen = new Set<string>();
  const result: Recipe[] = [];
  for (const recipe of getRecipesInMenu(menu, recipes)) {
    if (seen.has(recipe.id)) continue;
    seen.add(recipe.id);
    result.push(recipe);
  }
  return result;
}

export function findDish(
  menu: WeekMenu,
  date: string,
  meal: MealType,
  index: number,
): MenuDish | undefined {
  return getDay(menu, date)?.meals[meal][index];
}

function updateDay(
  menu: WeekMenu,
  date: string,
  updater: (day: DayMenu) => DayMenu,
  now?: Date,
): WeekMenu {
  return {
    ...menu,
    days: menu.days.map((day) => (day.date === date ? updater(day) : day)),
    updatedAt: nowIso(now),
  };
}

function replaceMeal(day: DayMenu, meal: MealType, dishes: MenuDish[]): DayMenu {
  return { ...day, meals: { ...day.meals, [meal]: dedupeDishes(dishes) } };
}

function recipesOutsideSlot(
  menu: WeekMenu,
  recipes: Recipe[],
  date: string,
  meal: MealType,
  keepLocked: boolean,
): Recipe[] {
  const byId = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const result: Recipe[] = [];
  for (const day of menu.days) {
    for (const otherMeal of MEAL_ORDER) {
      for (const dish of day.meals[otherMeal]) {
        const inTarget = day.date === date && otherMeal === meal;
        if (inTarget && !keepLocked) continue;
        if (inTarget && keepLocked && !dish.locked) continue;
        const recipe = byId.get(dish.recipeId);
        if (recipe) result.push(recipe);
      }
    }
  }
  return result;
}

/**
 * 重新生成某一餐：保留该餐已锁定的菜，其余重新推荐。
 */
export function regenerateSlot(
  menu: WeekMenu,
  ref: { date: string; meal: MealType },
  options: MenuActionOptions,
): WeekMenu {
  const day = getDay(menu, ref.date);
  if (!day) return menu;
  const target = day.meals[ref.meal];
  const locked = target.filter((dish) => dish.locked);
  const unlockedIds = target.filter((dish) => !dish.locked).map((dish) => dish.recipeId);
  const quota = Math.max(0, SLOT_TARGETS[ref.meal] - locked.length);
  if (quota === 0) return menu;

  const preused = recipesOutsideSlot(menu, options.recipes, ref.date, ref.meal, false);
  const seed = options.seed ?? `${menu.id}|${ref.date}|${ref.meal}|${timestampId(options.now)}`;
  const excluded = new Set([...(options.excludeRecipeIds ?? []), ...unlockedIds]);

  const result = fillSlot({
    recipes: options.recipes,
    preferences: options.preferences,
    meal: ref.meal,
    count: quota,
    existingRecipeIds: locked.map((dish) => dish.recipeId),
    weekRecipes: preused,
    excludeRecipeIds: [...excluded].filter(
      (id) => !locked.some((dish) => dish.recipeId === id),
    ),
    seed,
  });

  const generated = result.dishes.map((dish: DishRecommendation) =>
    toMenuDish(dish.recipe.id, false, 'generated', options.now, dish.reasons),
  );
  const nextDishes = dedupeDishes([...locked, ...generated]);
  return updateDay(
    menu,
    ref.date,
    (current) => replaceMeal(current, ref.meal, nextDishes),
    options.now,
  );
}

/**
 * 重新生成某一天的三餐，保留当天已锁定的菜。
 */
export function regenerateDay(
  menu: WeekMenu,
  date: string,
  options: MenuActionOptions,
): WeekMenu {
  const day = getDay(menu, date);
  if (!day) return menu;
  const seed = options.seed ?? `${menu.id}|${date}|${timestampId(options.now)}`;
  let next = menu;
  for (const meal of MEAL_ORDER) {
    next = regenerateSlot(next, { date, meal }, { ...options, seed: `${seed}|${meal}` });
  }
  return { ...next, updatedAt: nowIso(options.now) };
}

/**
 * 手动替换单道菜：保留其他菜与锁定状态。
 */
export function replaceDish(
  menu: WeekMenu,
  ref: { date: string; meal: MealType; index: number },
  recipeId: string,
  options: { now?: Date; reasons?: string[] } = {},
): WeekMenu {
  const day = getDay(menu, ref.date);
  if (!day) return menu;
  const mealDishes = day.meals[ref.meal];
  if (ref.index < 0 || ref.index >= mealDishes.length) return menu;
  if (mealDishes.some((dish, index) => index !== ref.index && dish.recipeId === recipeId)) {
    return menu;
  }
  const current = mealDishes[ref.index];
  if (!current) return menu;
  const nextDishes = mealDishes.map((dish, index) =>
    index === ref.index
      ? toMenuDish(recipeId, dish.locked, 'manual', options.now, options.reasons)
      : dish,
  );
  return updateDay(
    menu,
    ref.date,
    (currentDay) => replaceMeal(currentDay, ref.meal, nextDishes),
    options.now,
  );
}

export function addDish(
  menu: WeekMenu,
  ref: { date: string; meal: MealType },
  recipeId: string,
  options: { now?: Date } = {},
): WeekMenu {
  const day = getDay(menu, ref.date);
  if (!day) return menu;
  const mealDishes = day.meals[ref.meal];
  if (mealDishes.some((dish) => dish.recipeId === recipeId)) return menu;
  if (mealDishes.length >= 5) return menu;
  const nextDishes = [...mealDishes, toMenuDish(recipeId, false, 'manual', options.now)];
  return updateDay(
    menu,
    ref.date,
    (currentDay) => replaceMeal(currentDay, ref.meal, nextDishes),
    options.now,
  );
}

export function removeDish(
  menu: WeekMenu,
  ref: { date: string; meal: MealType; index: number },
  options: { now?: Date } = {},
): WeekMenu {
  const day = getDay(menu, ref.date);
  if (!day) return menu;
  if (ref.index < 0 || ref.index >= day.meals[ref.meal].length) return menu;
  const nextDishes = day.meals[ref.meal].filter((_, index) => index !== ref.index);
  return updateDay(
    menu,
    ref.date,
    (currentDay) => replaceMeal(currentDay, ref.meal, nextDishes),
    options.now,
  );
}

export function toggleDishLock(
  menu: WeekMenu,
  ref: { date: string; meal: MealType; index: number },
  options: { now?: Date } = {},
): WeekMenu {
  const day = getDay(menu, ref.date);
  if (!day) return menu;
  const mealDishes = day.meals[ref.meal];
  if (ref.index < 0 || ref.index >= mealDishes.length) return menu;
  const nextDishes = mealDishes.map((dish, index) =>
    index === ref.index ? { ...dish, locked: !dish.locked } : dish,
  );
  return updateDay(
    menu,
    ref.date,
    (currentDay) => replaceMeal(currentDay, ref.meal, nextDishes),
    options.now,
  );
}

/** 取当前时刻在菜单时区中的「今天」；若不在本周，则回落到周一 */
export function resolveToday(menu: WeekMenu, now: Date = new Date()): {
  date: string;
  inWeek: boolean;
} {
  const today = todayInTimeZone(menu.timezone, now);
  const inWeek = menu.days.some((day) => day.date === today);
  return { date: inWeek ? today : menu.weekStart, inWeek };
}

export interface MenuSummary {
  dishCount: number;
  uniqueRecipeCount: number;
  averageMinutes: number;
  cuisines: string[];
  breakfastCount: number;
  lunchCount: number;
  dinnerCount: number;
}

export function summarizeMenu(menu: WeekMenu, recipes: Recipe[]): MenuSummary {
  const unique = getUniqueRecipes(menu, recipes);
  const allRecipes = getRecipesInMenu(menu, recipes);
  const averageMinutes =
    allRecipes.length > 0
      ? Math.round(
          allRecipes.reduce((total, recipe) => total + totalMinutes(recipe), 0) / allRecipes.length,
        )
      : 0;
  return {
    dishCount: allRecipes.length,
    uniqueRecipeCount: unique.length,
    averageMinutes,
    cuisines: [...new Set(unique.map((recipe) => recipe.cuisine))],
    breakfastCount: menu.days.reduce((total, day) => total + day.meals.breakfast.length, 0),
    lunchCount: menu.days.reduce((total, day) => total + day.meals.lunch.length, 0),
    dinnerCount: menu.days.reduce((total, day) => total + day.meals.dinner.length, 0),
  };
}

/** 下一周 / 上一周的周一 */
export function shiftWeek(weekStart: string, weeks: number): string {
  return addDays(startOfWeekMonday(assertDateString(weekStart)), weeks * 7);
}

/** 供 UI 判断当前周是否包含今天 */
export function weekContains(weekStart: string, date: string): boolean {
  return weekDates(weekStart).includes(date);
}

/**
 * 从已有菜单推导出「锁定菜」映射，便于在其他端重建同一份菜单。
 */
export function extractLockedRecipeIds(menu: WeekMenu): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const day of menu.days) {
    for (const meal of MEAL_ORDER) {
      const locked = day.meals[meal].filter((dish) => dish.locked).map((dish) => dish.recipeId);
      if (locked.length > 0) result[slotKey(day.date, meal)] = locked;
    }
  }
  return result;
}

/** 槽位空缺时用于 UI 展示的占位菜数量 */
export function missingSlotCount(menu: WeekMenu, meal: MealType): number {
  return menu.days.reduce((total, day) => {
    const missing = Math.max(0, SLOT_TARGETS[meal] - day.meals[meal].length);
    return total + missing;
  }, 0);
}
