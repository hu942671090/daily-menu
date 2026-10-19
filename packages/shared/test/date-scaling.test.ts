import assert from 'node:assert/strict';
import test from 'node:test';
import {
  addDays,
  diffDays,
  formatChineseDate,
  formatMinutes,
  startOfWeekMonday,
  todayInTimeZone,
  weekDates,
  weekdayIndex,
  weekdayLabel,
} from '../src/date';
import { formatAmount, scaleAmountValue, scaleIngredient, servingsFactor } from '../src/scaling';
import type { IngredientItem } from '../src/types';

test('时区：按 Asia/Shanghai 计算「今天」的日期边界', () => {
  assert.equal(todayInTimeZone('Asia/Shanghai', new Date('2026-10-19T15:30:00Z')), '2026-10-19');
  assert.equal(todayInTimeZone('Asia/Shanghai', new Date('2026-10-19T16:30:00Z')), '2026-10-20');
  assert.equal(todayInTimeZone('America/New_York', new Date('2026-10-19T03:30:00Z')), '2026-10-18');
});

test('时区：非法时区回落到默认北京时间', () => {
  assert.equal(todayInTimeZone('Not/AZone', new Date('2026-10-19T16:30:00Z')), '2026-10-20');
});

test('日期：周一为起点，跨月连续', () => {
  assert.equal(weekdayIndex('2026-10-19'), 0);
  assert.equal(weekdayIndex('2026-10-25'), 6);
  assert.equal(startOfWeekMonday('2026-10-22'), '2026-10-19');
  assert.deepEqual(weekDates('2026-10-19'), [
    '2026-10-19',
    '2026-10-20',
    '2026-10-21',
    '2026-10-22',
    '2026-10-23',
    '2026-10-24',
    '2026-10-25',
  ]);
  assert.equal(addDays('2026-10-31', 1), '2026-11-01');
  assert.equal(diffDays('2026-10-19', '2026-10-25'), 6);
  assert.equal(weekdayLabel('2026-10-19'), '周一');
});

test('日期：中文格式与时长格式', () => {
  assert.equal(formatChineseDate('2026-10-19'), '10月19日 周一');
  assert.equal(formatChineseDate('2026-10-19', false), '10月19日');
  assert.equal(formatMinutes(25), '25 分钟');
  assert.equal(formatMinutes(70), '1 小时 10 分钟');
  assert.equal(formatMinutes(120), '2 小时');
});

test('份量换算：按比例调整并合理取整', () => {
  assert.equal(servingsFactor(3, 2), 1.5);
  assert.equal(scaleAmountValue(300, '克', 1.5), 450);
  assert.equal(scaleAmountValue(3, '个', 1.5), 4.5);
  assert.equal(scaleAmountValue(1, '个', 0.25), 0.5);
  assert.equal(scaleAmountValue(5, '克', 1.5), 7.5);
  assert.equal(formatAmount(450, '克'), '450 克');
  assert.equal(formatAmount(1.5, '个'), '1.5 个');
  assert.equal(formatAmount(null, '', '少许'), '少许');
});

test('份量换算：不可换算的「少许」保留文字', () => {
  const salt: IngredientItem = {
    id: 'salt',
    name: '盐',
    amount: null,
    unit: '',
    display: '少许',
    scalable: false,
  };
  const scaled = scaleIngredient(salt, 6, 2);
  assert.equal(scaled.amount, null);
  assert.equal(scaled.amountText, '少许');
  assert.equal(scaled.scaled, false);
});

test('份量换算：scalable=false 的数值用量不随人数变化', () => {
  const oil: IngredientItem = {
    id: 'oil',
    name: '食用油',
    amount: 20,
    unit: '毫升',
    scalable: false,
  };
  const scaled = scaleIngredient(oil, 4, 2);
  assert.equal(scaled.amount, 20);
  assert.equal(scaled.amountText, '20 毫升');
});
