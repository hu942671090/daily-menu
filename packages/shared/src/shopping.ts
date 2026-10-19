/**
 * 购物清单：按名称 + 单位合并菜单中的食材用量。
 * - 数值用量按用餐人数换算后合并；
 * - 「少许 / 适量」等文字用量单独保留，不参与求和；
 * - 勾选状态由调用方持久化（按周保存）。
 */
import { MEAL_ORDER } from './constants';
import { weekDates } from './date';
import { scaleAmountValue, servingsFactor } from './scaling';
import type { IngredientItem, Recipe, ShoppingListItem, WeekMenu } from './types';

export interface ShoppingListOptions {
  recipes: Recipe[];
  /** 默认整周；传入日期则只统计这些天 */
  dates?: string[];
  /** 覆盖菜单偏好中的用餐人数 */
  servings?: number;
  /** 已勾选状态，key 为 ShoppingListItem.key */
  checks?: Record<string, boolean>;
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '');
}

export function shoppingItemKey(name: string, unit: string): string {
  return `${normalizeName(name)}|${unit}`;
}

interface Accumulator {
  name: string;
  unit: string;
  group: ShoppingListItem['group'];
  amount: number | null;
  textAmounts: Set<string>;
  recipeIds: Set<string>;
}

export function buildShoppingList(menu: WeekMenu, options: ShoppingListOptions): ShoppingListItem[] {
  const byId = new Map(options.recipes.map((recipe) => [recipe.id, recipe]));
  const servings = options.servings ?? menu.preferences.servings;
  const dates = options.dates && options.dates.length > 0 ? new Set(options.dates) : null;
  const buckets = new Map<string, Accumulator>();

  for (const day of menu.days) {
    if (dates && !dates.has(day.date)) continue;
    for (const meal of MEAL_ORDER) {
      for (const dish of day.meals[meal]) {
        const recipe = byId.get(dish.recipeId);
        if (!recipe) continue;
        const factor = servingsFactor(servings, recipe.baseServings);
        for (const group of recipe.ingredientGroups) {
          for (const item of group.items) {
            accumulate(buckets, item, group.id, recipe, factor);
          }
        }
      }
    }
  }

  const checks = options.checks ?? {};
  return [...buckets.entries()]
    .map(([key, bucket]) => ({
      key,
      name: bucket.name,
      unit: bucket.unit,
      group: bucket.group,
      amount: bucket.amount,
      textAmounts: [...bucket.textAmounts],
      recipeIds: [...bucket.recipeIds],
      checked: Boolean(checks[key]),
    }))
    .sort((left, right) => {
      if (left.group !== right.group) return left.group === 'main' ? -1 : 1;
      return left.name.localeCompare(right.name, 'zh-Hans-CN');
    });
}

function accumulate(
  buckets: Map<string, Accumulator>,
  item: IngredientItem,
  group: ShoppingListItem['group'],
  recipe: Recipe,
  factor: number,
): void {
  const key = shoppingItemKey(item.name, item.unit);
  const existing = buckets.get(key) ?? {
    name: item.name,
    unit: item.unit,
    group,
    amount: null,
    textAmounts: new Set<string>(),
    recipeIds: new Set<string>(),
  };
  existing.recipeIds.add(recipe.id);

  const canScale = item.scalable && item.amount !== null && Math.abs(factor - 1) > 0.001;
  const amount =
    item.amount === null
      ? null
      : canScale
        ? scaleAmountValue(item.amount, item.unit, factor)
        : item.amount;

  if (amount === null) {
    existing.textAmounts.add(item.display ?? '适量');
  } else {
    existing.amount = Math.round(((existing.amount ?? 0) + amount) * 10) / 10;
  }
  buckets.set(key, existing);
}

export function toggleShoppingCheck(
  items: ShoppingListItem[],
  key: string,
): ShoppingListItem[] {
  return items.map((item) => (item.key === key ? { ...item, checked: !item.checked } : item));
}

export interface ShoppingStats {
  total: number;
  checked: number;
  remaining: number;
  completion: number;
}

export function shoppingStats(items: ShoppingListItem[]): ShoppingStats {
  const checked = items.filter((item) => item.checked).length;
  const total = items.length;
  return {
    total,
    checked,
    remaining: total - checked,
    completion: total === 0 ? 0 : Math.round((checked / total) * 100),
  };
}

/** 只统计指定日期（默认今天）时使用的辅助函数 */
export function shoppingDatesForToday(menu: WeekMenu, today: string): string[] {
  return weekDates(menu.weekStart).includes(today) ? [today] : [];
}
