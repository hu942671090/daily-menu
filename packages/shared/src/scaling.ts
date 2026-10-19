import type { IngredientItem } from './types';

const COUNT_UNITS = new Set([
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
]);

const SPOON_UNITS = new Set(['勺', '汤匙', '茶匙', '小勺', '大勺']);
const MASS_UNITS = new Set(['克', 'g', 'G', '毫升', 'ml', 'ML']);

export function normalizeServings(servings: number, fallback = 2): number {
  if (!Number.isFinite(servings)) return fallback;
  return Math.min(12, Math.max(1, Math.round(servings)));
}

export function servingsFactor(servings: number, baseServings: number): number {
  const base = baseServings > 0 ? baseServings : 2;
  return normalizeServings(servings, base) / base;
}

/** 按单位选择合理的取整方式，避免出现「0.333 个鸡蛋」这类不可执行用量 */
export function scaleAmountValue(amount: number, unit: string, factor: number): number {
  const raw = amount * factor;
  if (!Number.isFinite(raw) || raw <= 0) return 0;
  if (COUNT_UNITS.has(unit)) {
    return Math.max(0.5, Math.round(raw * 2) / 2);
  }
  if (SPOON_UNITS.has(unit)) {
    return Math.max(0.5, Math.round(raw * 10) / 10);
  }
  if (MASS_UNITS.has(unit)) {
    if (raw >= 100) return Math.round(raw / 5) * 5;
    if (raw >= 10) return Math.round(raw);
    return Math.max(1, Math.round(raw * 10) / 10);
  }
  return Math.round(raw * 10) / 10;
}

export function formatNumber(value: number): string {
  if (Number.isInteger(value)) return String(value);
  return String(Math.round(value * 10) / 10);
}

export function formatAmount(amount: number | null, unit: string, display?: string): string {
  if (amount === null) return display ?? '适量';
  const value = formatNumber(amount);
  if (!unit || unit === '个' || COUNT_UNITS.has(unit)) {
    return unit ? `${value} ${unit}` : value;
  }
  return `${value} ${unit}`;
}

export interface ScaledIngredientItem {
  item: IngredientItem;
  amount: number | null;
  /** 例如「300 克」「少许」 */
  amountText: string;
  /** 是否发生了换算（用于 UI 提示） */
  scaled: boolean;
}

export function scaleIngredient(
  item: IngredientItem,
  servings: number,
  baseServings: number,
): ScaledIngredientItem {
  const factor = servingsFactor(servings, baseServings);
  const canScale = item.scalable && item.amount !== null;
  if (!canScale) {
    return {
      item,
      amount: item.amount,
      amountText: item.amount === null ? item.display ?? '适量' : formatAmount(item.amount, item.unit),
      scaled: false,
    };
  }
  const amount = scaleAmountValue(item.amount as number, item.unit, factor);
  return {
    item,
    amount,
    amountText: formatAmount(amount, item.unit),
    scaled: Math.abs(factor - 1) > 0.001,
  };
}

/** 「番茄 300 克（切块）」 */
export function formatIngredientLine(
  item: IngredientItem,
  servings: number,
  baseServings: number,
): string {
  const scaled = scaleIngredient(item, servings, baseServings);
  const note = item.note ? `（${item.note}）` : '';
  return `${item.name} ${scaled.amountText}${note}`;
}
