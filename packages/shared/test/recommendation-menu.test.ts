import assert from 'node:assert/strict';
import test from 'node:test';
import { createDefaultPreferences } from '../src/store';
import { fillSlot, recommendWeek } from '../src/recommendation';
import {
  createWeekMenu,
  extractLockedRecipeIds,
  getDay,
  regenerateSlot,
  replaceDish,
  resolveToday,
  summarizeMenu,
  toggleDishLock,
  removeDish,
  addDish,
} from '../src/menu';
import type { Preferences } from '../src/types';
import { TEST_RECIPES } from './fixtures';

const WEEK_START = '2026-10-19';

function preferences(overrides: Partial<Preferences> = {}): Preferences {
  return { ...createDefaultPreferences(), ...overrides };
}

function allDishes(menu: ReturnType<typeof createWeekMenu>) {
  return menu.days.flatMap((day) =>
    Object.entries(day.meals).flatMap(([meal, dishes]) =>
      dishes.map((dish) => ({ ...dish, date: day.date, meal })),
    ),
  );
}

test('推荐：先排除过敏原、忌口与不喜欢的食材', () => {
  const result = recommendWeek({
    recipes: TEST_RECIPES,
    preferences: preferences({ allergens: ['花生'], dislikedIngredients: ['猪肉'] }),
    weekStart: WEEK_START,
    timezone: 'Asia/Shanghai',
    seed: 'allergen-test',
  });
  const ids = result.slots.flatMap((slot) => slot.dishes.map((dish) => dish.recipe.id));
  assert.ok(!ids.includes('peanut-porridge'), '含花生的菜谱不应出现');
  assert.ok(!ids.includes('pepper-pork'), '含猪肉的菜谱不应出现');
  assert.ok(!ids.includes('braised-pork'), '含猪肉的菜谱不应出现');
  assert.ok(result.diagnostics.excludedByIngredient >= 2);
});

test('推荐：超过可接受耗时的菜谱被排除', () => {
  const result = recommendWeek({
    recipes: TEST_RECIPES,
    preferences: preferences({ maxCookMinutes: 30 }),
    weekStart: WEEK_START,
    timezone: 'Asia/Shanghai',
    seed: 'time-test',
  });
  const dishes = result.slots.flatMap((slot) => slot.dishes);
  assert.ok(dishes.length > 0);
  for (const dish of dishes) {
    assert.ok(dish.recipe.prepMinutes + dish.recipe.cookMinutes <= 30);
  }
  assert.ok(result.diagnostics.excludedByTime >= 1);
});

test('推荐：相同输入与种子完全可复现', () => {
  const input = {
    recipes: TEST_RECIPES,
    preferences: preferences({ cuisines: ['家常菜'], tastes: ['咸鲜'] }),
    weekStart: WEEK_START,
    timezone: 'Asia/Shanghai',
    seed: 'deterministic',
  } as const;
  const first = recommendWeek(input);
  const second = recommendWeek(input);
  assert.deepEqual(
    first.slots.map((slot) => slot.dishes.map((dish) => dish.recipe.id)),
    second.slots.map((slot) => slot.dishes.map((dish) => dish.recipe.id)),
  );
});

test('推荐：每餐道数符合餐次默认值，且同餐不重复', () => {
  const menu = createWeekMenu({
    weekStart: WEEK_START,
    preferences: preferences(),
    recipes: TEST_RECIPES,
    timezone: 'Asia/Shanghai',
  });
  assert.equal(menu.days.length, 7);
  for (const day of menu.days) {
    assert.equal(day.meals.breakfast.length, 1);
    assert.equal(day.meals.lunch.length, 2);
    assert.equal(day.meals.dinner.length, 2);
    for (const meal of ['breakfast', 'lunch', 'dinner'] as const) {
      const ids = day.meals[meal].map((dish) => dish.recipeId);
      assert.equal(new Set(ids).size, ids.length, `${day.date} ${meal} 不应重复同一道菜`);
    }
  }
  assert.equal(allDishes(menu).length, 35);
});

test('推荐：每条推荐都带有可解释理由', () => {
  const result = recommendWeek({
    recipes: TEST_RECIPES,
    preferences: preferences(),
    weekStart: WEEK_START,
    timezone: 'Asia/Shanghai',
    seed: 'reason-test',
  });
  for (const slot of result.slots) {
    for (const dish of slot.dishes) {
      assert.ok(dish.reasons.length > 0, `${dish.recipe.name} 缺少推荐理由`);
    }
  }
});

test('菜单：锁定的菜在生成时保留，重新生成某一餐时仍保留', () => {
  const lockedRecipeIds = { [`${WEEK_START}:lunch`]: ['curry-chicken'] };
  const menu = createWeekMenu({
    weekStart: WEEK_START,
    preferences: preferences(),
    recipes: TEST_RECIPES,
    timezone: 'Asia/Shanghai',
    lockedRecipeIds,
  });
  const day = getDay(menu, WEEK_START);
  assert.ok(day);
  assert.equal(day?.meals.lunch[0]?.recipeId, 'curry-chicken');
  assert.equal(day?.meals.lunch[0]?.locked, true);
  assert.equal(day?.meals.lunch.length, 2);

  const regenerated = regenerateSlot(
    menu,
    { date: WEEK_START, meal: 'lunch' },
    { recipes: TEST_RECIPES, preferences: preferences(), seed: 'regen-lunch' },
  );
  const nextDay = getDay(regenerated, WEEK_START);
  assert.equal(nextDay?.meals.lunch[0]?.recipeId, 'curry-chicken');
  assert.equal(nextDay?.meals.lunch[0]?.locked, true);
  assert.equal(nextDay?.meals.lunch.length, 2);
  assert.notEqual(regenerated.updatedAt, menu.updatedAt);
});

test('菜单：替换单道菜不影响同餐其他菜与锁定状态', () => {
  const menu = createWeekMenu({
    weekStart: WEEK_START,
    preferences: preferences(),
    recipes: TEST_RECIPES,
    timezone: 'Asia/Shanghai',
  });
  const day = getDay(menu, WEEK_START);
  assert.ok(day);
  const before = [...day.meals.dinner.map((dish) => dish.recipeId)];

  const lockedMenu = toggleDishLock(menu, { date: WEEK_START, meal: 'dinner', index: 1 });
  const replaced = replaceDish(
    lockedMenu,
    { date: WEEK_START, meal: 'dinner', index: 0 },
    'cold-cucumber',
  );
  const replacedDay = getDay(replaced, WEEK_START);
  assert.equal(replacedDay?.meals.dinner[0]?.recipeId, 'cold-cucumber');
  assert.equal(replacedDay?.meals.dinner[0]?.origin, 'manual');
  assert.equal(replacedDay?.meals.dinner[1]?.recipeId, before[1]);
  assert.equal(replacedDay?.meals.dinner[1]?.locked, true);
});

test('菜单：添加与移除菜品', () => {
  const menu = createWeekMenu({
    weekStart: WEEK_START,
    preferences: preferences(),
    recipes: TEST_RECIPES,
    timezone: 'Asia/Shanghai',
  });
  const mealRef = { date: WEEK_START, meal: 'breakfast' as const };
  const before = getDay(menu, WEEK_START)?.meals.breakfast.length ?? 0;
  const added = addDish(menu, mealRef, 'tomato-egg');
  assert.equal(getDay(added, WEEK_START)?.meals.breakfast.length, before + 1);
  const duplicate = addDish(added, mealRef, 'tomato-egg');
  assert.equal(getDay(duplicate, WEEK_START)?.meals.breakfast.length, before + 1);
  const removed = removeDish(added, { ...mealRef, index: before });
  assert.equal(getDay(removed, WEEK_START)?.meals.breakfast.length, before);
});

test('菜单：锁定快照可提取，用于重建同一份菜单', () => {
  const menu = createWeekMenu({
    weekStart: WEEK_START,
    preferences: preferences(),
    recipes: TEST_RECIPES,
    timezone: 'Asia/Shanghai',
    lockedRecipeIds: { [`${WEEK_START}:dinner`]: ['braised-pork'] },
  });
  const locked = extractLockedRecipeIds(menu);
  assert.deepEqual(locked[`${WEEK_START}:dinner`], ['braised-pork']);
});

test('菜单：今日判断按菜单时区进行，跨周时回落到周一', () => {
  const menu = createWeekMenu({
    weekStart: WEEK_START,
    preferences: preferences(),
    recipes: TEST_RECIPES,
    timezone: 'Asia/Shanghai',
  });
  assert.deepEqual(resolveToday(menu, new Date('2026-10-21T04:00:00Z')), {
    date: '2026-10-21',
    inWeek: true,
  });
  assert.deepEqual(resolveToday(menu, new Date('2026-11-01T04:00:00Z')), {
    date: WEEK_START,
    inWeek: false,
  });
});

test('菜单：概览统计与去重', () => {
  const menu = createWeekMenu({
    weekStart: WEEK_START,
    preferences: preferences(),
    recipes: TEST_RECIPES,
    timezone: 'Asia/Shanghai',
  });
  const summary = summarizeMenu(menu, TEST_RECIPES);
  assert.equal(summary.dishCount, 35);
  assert.ok(summary.uniqueRecipeCount <= TEST_RECIPES.length);
  assert.ok(summary.averageMinutes > 0);
  assert.equal(summary.breakfastCount + summary.lunchCount + summary.dinnerCount, summary.dishCount);
});

test('推荐：可用菜谱不足时给出明确说明而不是编造菜品', () => {
  const result = fillSlot({
    recipes: TEST_RECIPES.filter((recipe) => recipe.mealTypes.includes('breakfast')),
    preferences: preferences(),
    meal: 'breakfast',
    count: 2,
    seed: 'limited',
  });
  assert.ok(result.dishes.length >= 1);
  const limited = fillSlot({
    recipes: TEST_RECIPES.filter((recipe) => recipe.id === 'millet-porridge'),
    preferences: preferences(),
    meal: 'breakfast',
    count: 3,
    seed: 'limited-2',
  });
  assert.equal(limited.dishes.length, 1);
  assert.ok(limited.relaxedNotes.some((note) => note.includes('可选菜谱不足')));
  assert.ok(result.dishes[0]);
});
