import assert from 'node:assert/strict';
import test from 'node:test';
import { buildShoppingList, shoppingStats, shoppingItemKey } from '../src/shopping';
import {
  MemoryStorage,
  createDefaultPreferences,
  createStorageRepository,
  sanitizeMenu,
  sanitizePreferences,
} from '../src/store';
import { weekDates } from '../src/date';
import type { MealType, MenuDish, WeekMenu } from '../src/types';
import { TEST_RECIPES } from './fixtures';

const WEEK_START = '2026-10-19';

function dish(recipeId: string): MenuDish {
  return { recipeId, locked: false, origin: 'generated', addedAt: '2026-10-19T00:00:00.000Z' };
}

function makeMenu(plan: Partial<Record<string, Partial<Record<MealType, string[]>>>>, servings = 2): WeekMenu {
  return {
    id: `menu:Asia/Shanghai:${WEEK_START}`,
    weekStart: WEEK_START,
    timezone: 'Asia/Shanghai',
    days: weekDates(WEEK_START).map((date) => ({
      date,
      meals: {
        breakfast: (plan[date]?.breakfast ?? []).map(dish),
        lunch: (plan[date]?.lunch ?? []).map(dish),
        dinner: (plan[date]?.dinner ?? []).map(dish),
      },
    })),
    strategy: 'rules-v1',
    preferences: { ...createDefaultPreferences(), servings },
    generatedAt: '2026-10-19T00:00:00.000Z',
    updatedAt: '2026-10-19T00:00:00.000Z',
    schemaVersion: 1,
  };
}

test('购物清单：同名同单位跨菜合并数量', () => {
  const menu = makeMenu({
    [WEEK_START]: {
      lunch: ['tomato-egg', 'pepper-pork'],
      dinner: ['tomato-egg'],
    },
  });
  const items = buildShoppingList(menu, { recipes: TEST_RECIPES, servings: 2 });
  const tomato = items.find((item) => item.name === '番茄');
  assert.ok(tomato);
  // 测试数据每份主料 200 克，番茄炒蛋出现两次，2 人份 = 基准份量
  assert.equal(tomato?.amount, 400);
  assert.equal(tomato?.unit, '克');
  assert.equal(tomato?.group, 'main');

  const salt = items.find((item) => item.name === '盐');
  assert.ok(salt);
  assert.equal(salt?.amount, null);
  assert.deepEqual(salt?.textAmounts, ['少许']);
});

test('购物清单：按用餐人数换算用量', () => {
  const menu = makeMenu({ [WEEK_START]: { lunch: ['tomato-egg'] } }, 4);
  const items = buildShoppingList(menu, { recipes: TEST_RECIPES, servings: 4 });
  const tomato = items.find((item) => item.name === '番茄');
  assert.equal(tomato?.amount, 400); // 200 克 × (4 / 2)
});

test('购物清单：只统计指定日期', () => {
  const menu = makeMenu({
    [WEEK_START]: { lunch: ['tomato-egg'] },
    '2026-10-20': { dinner: ['curry-chicken'] },
  });
  const items = buildShoppingList(menu, {
    recipes: TEST_RECIPES,
    dates: ['2026-10-20'],
  });
  assert.ok(items.some((item) => item.name === '鸡肉'));
  assert.ok(!items.some((item) => item.name === '番茄'));
});

test('购物清单：勾选状态透传与统计', () => {
  const menu = makeMenu({ [WEEK_START]: { lunch: ['tomato-egg'] } });
  const items = buildShoppingList(menu, { recipes: TEST_RECIPES });
  const key = shoppingItemKey('番茄', '克');
  const withCheck = items.map((item) => (item.key === key ? { ...item, checked: true } : item));
  const stats = shoppingStats(withCheck);
  assert.equal(stats.checked, 1);
  assert.equal(stats.total, items.length);
  assert.equal(stats.completion, Math.round((1 / items.length) * 100));
});

test('持久化：偏好保存后可恢复，非法值被收敛', () => {
  const storage = new MemoryStorage();
  const repository = createStorageRepository(storage);
  const saved = repository.savePreferences({
    ...createDefaultPreferences(),
    servings: 99,
    maxCookMinutes: 5,
    cuisines: ['川湘', '不存在的菜系'] as never,
    allergens: ['花生'],
  });
  assert.equal(saved.servings, 12);
  assert.equal(saved.maxCookMinutes, 10);
  assert.deepEqual(saved.cuisines, ['川湘']);
  assert.deepEqual(saved.allergens, ['花生']);

  const loaded = repository.loadPreferences();
  assert.equal(loaded.servings, 12);
  assert.deepEqual(loaded.cuisines, ['川湘']);
});

test('持久化：收藏可添加、去重、取消', () => {
  const storage = new MemoryStorage();
  const repository = createStorageRepository(storage);
  repository.toggleFavorite('tomato-egg');
  assert.equal(repository.loadFavorites().length, 1);
  assert.equal(repository.isFavorite('tomato-egg'), true);
  repository.toggleFavorite('tomato-egg');
  assert.equal(repository.loadFavorites().length, 0);
  assert.equal(repository.isFavorite('tomato-egg'), false);
});

test('持久化：周菜单保存、读取、恢复 7 天结构', () => {
  const storage = new MemoryStorage();
  const repository = createStorageRepository(storage);
  const menu = makeMenu({ [WEEK_START]: { dinner: ['braised-pork'] } });
  repository.saveMenu(menu);
  const loaded = repository.loadMenu(WEEK_START);
  assert.equal(loaded?.weekStart, WEEK_START);
  assert.equal(loaded?.days.length, 7);
  assert.equal(loaded?.days[0]?.meals.dinner[0]?.recipeId, 'braised-pork');
  assert.deepEqual(repository.listSavedWeeks(), [WEEK_START]);

  // 损坏/缺天的数据应补回 7 天，而不是渲染出错
  storage.setItem(
    'dm.v1.menus',
    JSON.stringify({ [WEEK_START]: { ...menu, days: [{ date: WEEK_START, meals: { breakfast: [], lunch: [], dinner: [] } }] } }),
  );
  const repaired = repository.loadMenu(WEEK_START);
  assert.equal(repaired?.days.length, 7);
  assert.equal(repaired?.days[3]?.date, '2026-10-22');

  repository.deleteMenu(WEEK_START);
  assert.equal(repository.loadMenu(WEEK_START), null);
});

test('持久化：购物清单勾选按周保存', () => {
  const storage = new MemoryStorage();
  const repository = createStorageRepository(storage);
  repository.saveShoppingChecks(WEEK_START, { '番茄|克': true });
  assert.deepEqual(repository.loadShoppingChecks(WEEK_START), { '番茄|克': true });
  assert.deepEqual(repository.loadShoppingChecks('2026-10-26'), {});
});

test('持久化：数据损坏时回退默认值', () => {
  const storage = new MemoryStorage();
  storage.setItem('dm.v1.preferences', '{not-json');
  storage.setItem('dm.v1.favorites', '"nope"');
  storage.setItem('dm.v1.menus', '[]');
  const repository = createStorageRepository(storage);
  assert.equal(repository.loadPreferences().servings, 2);
  assert.deepEqual(repository.loadFavorites(), []);
  assert.equal(repository.loadMenu(WEEK_START), null);
});

test('持久化：快照导出与导入可往返', () => {
  const storage = new MemoryStorage();
  const repository = createStorageRepository(storage, {
    now: () => new Date('2026-10-19T12:00:00Z'),
  });
  repository.savePreferences({ ...createDefaultPreferences(), servings: 3, allergenTags: [] } as never);
  repository.toggleFavorite('cold-cucumber');
  repository.saveMenu(makeMenu({ [WEEK_START]: { lunch: ['cold-cucumber'] } }));
  const snapshot = repository.exportSnapshot();
  assert.equal(snapshot.preferences.servings, 3);
  assert.equal(snapshot.favorites.length, 1);

  const target = new MemoryStorage();
  const restored = createStorageRepository(target);
  restored.importSnapshot(snapshot);
  assert.equal(restored.loadPreferences().servings, 3);
  assert.equal(restored.loadFavorites()[0]?.recipeId, 'cold-cucumber');
  assert.equal(restored.loadMenu(WEEK_START)?.days[0]?.meals.lunch[0]?.recipeId, 'cold-cucumber');
});

test('校验：sanitizePreferences 与 sanitizeMenu 拒绝脏数据', () => {
  const clean = sanitizePreferences({ servings: -3, difficulties: [2, 2, 9], timezone: 'Bad/Zone' });
  assert.equal(clean.servings, 1);
  assert.deepEqual(clean.difficulties, [2]);
  assert.equal(clean.timezone, 'Asia/Shanghai');
  assert.equal(sanitizeMenu({ weekStart: 'not-a-date' }), null);
  assert.equal(sanitizeMenu({ weekStart: WEEK_START, days: 'oops' })?.days.length, 7);
});
