/**
 * 时区安全的日期工具。
 *
 * 约定：
 * - 菜单中的日期一律使用「目标时区的本地日期字符串」YYYY-MM-DD；
 * - 日期运算通过 UTC 零点进行，避免宿主机本地时区/夏令时干扰；
 * - 默认时区为 Asia/Shanghai，可通过 Preferences.timezone 覆盖。
 */
import { DEFAULT_TIMEZONE, WEEKDAY_LABELS, WEEKDAY_SHORT_LABELS } from './constants.js';

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const formatterCache = new Map<string, Intl.DateTimeFormat>();

/**
 * 无 Intl 时区能力时的兜底偏移（分钟）。仅覆盖无夏令时的常用时区；
 * 其余时区回落到运行环境的本地时间，并在文档中说明该限制。
 */
const FIXED_OFFSETS: Record<string, number> = {
  UTC: 0,
  'Asia/Shanghai': 480,
  'Asia/Hong_Kong': 480,
  'Asia/Singapore': 480,
  'Asia/Tokyo': 540,
};

let intlTimeZoneSupport: boolean | null = null;

function supportsIntlTimeZone(): boolean {
  if (intlTimeZoneSupport !== null) return intlTimeZoneSupport;
  try {
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Shanghai' });
    intlTimeZoneSupport = formatter.format(new Date()) !== '';
  } catch {
    intlTimeZoneSupport = false;
  }
  return intlTimeZoneSupport;
}

export interface ZonedDateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export function isValidTimeZone(timeZone: string): boolean {
  if (!timeZone || typeof timeZone !== 'string') return false;
  if (timeZone in FIXED_OFFSETS) {
    if (supportsIntlTimeZone()) {
      try {
        new Intl.DateTimeFormat('en-US', { timeZone }).format(new Date());
      } catch {
        return false;
      }
    }
    return true;
  }
  if (!supportsIntlTimeZone()) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

export function resolveTimeZone(timeZone?: string | null): string {
  if (timeZone && isValidTimeZone(timeZone)) return timeZone;
  return DEFAULT_TIMEZONE;
}

function getFormatter(timeZone: string): Intl.DateTimeFormat {
  const cached = formatterCache.get(timeZone);
  if (cached) return cached;
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  formatterCache.set(timeZone, formatter);
  return formatter;
}

export function getZonedParts(date: Date, timeZone = DEFAULT_TIMEZONE): ZonedDateParts {
  const zone = resolveTimeZone(timeZone);
  if (supportsIntlTimeZone()) {
    try {
      return readFormatterParts(getFormatter(zone).formatToParts(date));
    } catch {
      // 某些小程序基础库对 formatToParts 支持不完整，走兜底逻辑
    }
  }
  return fallbackZonedParts(date, zone);
}

function readFormatterParts(parts: Intl.DateTimeFormatPart[]): ZonedDateParts {
  const bucket: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== 'literal') bucket[part.type] = part.value;
  }
  const hour = Number(bucket.hour ?? '0');
  return {
    year: Number(bucket.year ?? '1970'),
    month: Number(bucket.month ?? '01'),
    day: Number(bucket.day ?? '01'),
    hour: hour === 24 ? 0 : hour,
    minute: Number(bucket.minute ?? '0'),
    second: Number(bucket.second ?? '0'),
  };
}

function fallbackZonedParts(date: Date, zone: string): ZonedDateParts {
  const offset = FIXED_OFFSETS[zone];
  if (offset === undefined) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
    };
  }
  const shifted = new Date(date.getTime() + offset * 60_000);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    second: shifted.getUTCSeconds(),
  };
}

function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0');
}

/** 当前时刻在指定时区的日期字符串 */
export function todayInTimeZone(timeZone = DEFAULT_TIMEZONE, now: Date = new Date()): string {
  const parts = getZonedParts(now, timeZone);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

/** 当前时刻在指定时区的「HH:mm」 */
export function currentClockInTimeZone(timeZone = DEFAULT_TIMEZONE, now: Date = new Date()): string {
  const parts = getZonedParts(now, timeZone);
  return `${pad(parts.hour)}:${pad(parts.minute)}`;
}

export function isDateString(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const match = DATE_PATTERN.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function assertDateString(value: string): string {
  if (!isDateString(value)) {
    throw new Error(`Invalid date string: ${value}`);
  }
  return value;
}

function toUtcDate(dateString: string): Date {
  assertDateString(dateString);
  return new Date(`${dateString}T00:00:00.000Z`);
}

function fromUtcDate(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/** 以 UTC 零点为基准做日期加减，返回 YYYY-MM-DD */
export function addDays(dateString: string, days: number): string {
  const date = toUtcDate(dateString);
  date.setUTCDate(date.getUTCDate() + days);
  return fromUtcDate(date);
}

/** b - a 的天数差 */
export function diffDays(a: string, b: string): number {
  const start = toUtcDate(a).getTime();
  const end = toUtcDate(b).getTime();
  return Math.round((end - start) / 86_400_000);
}

/** 周一 = 0，周日 = 6 */
export function weekdayIndex(dateString: string): number {
  return (toUtcDate(dateString).getUTCDay() + 6) % 7;
}

export function weekdayLabel(dateString: string, short = false): string {
  const labels = short ? WEEKDAY_SHORT_LABELS : WEEKDAY_LABELS;
  return labels[weekdayIndex(dateString)] ?? '';
}

/** 取所在周的周一 */
export function startOfWeekMonday(dateString: string): string {
  return addDays(dateString, -weekdayIndex(dateString));
}

export function weekDates(weekStart: string): string[] {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

export function isSameWeek(a: string, b: string): boolean {
  return startOfWeekMonday(a) === startOfWeekMonday(b);
}

export function dayOfMonth(dateString: string): number {
  return toUtcDate(dateString).getUTCDate();
}

export function monthOf(dateString: string): number {
  return toUtcDate(dateString).getUTCMonth() + 1;
}

/** 10月19日 周一 */
export function formatChineseDate(dateString: string, withWeekday = true): string {
  const month = monthOf(dateString);
  const day = dayOfMonth(dateString);
  return withWeekday
    ? `${month}月${day}日 ${weekdayLabel(dateString)}`
    : `${month}月${day}日`;
}

/** 10月19日 - 10月25日 */
export function formatWeekRange(weekStart: string): string {
  const end = addDays(weekStart, 6);
  return `${formatChineseDate(weekStart, false)} - ${formatChineseDate(end, false)}`;
}

/** 今天 / 明天 / 昨天 / 周X */
export function relativeDayLabel(dateString: string, today: string): string {
  const delta = diffDays(today, dateString);
  if (delta === 0) return '今天';
  if (delta === 1) return '明天';
  if (delta === -1) return '昨天';
  return weekdayLabel(dateString);
}

export function formatMinutes(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes < 0) return '—';
  if (minutes < 60) return `${Math.round(minutes)} 分钟`;
  const hours = Math.floor(minutes / 60);
  const rest = Math.round(minutes % 60);
  return rest === 0 ? `${hours} 小时` : `${hours} 小时 ${rest} 分钟`;
}

export function nowIso(now: Date = new Date()): string {
  return now.toISOString();
}

/** 生成周的稳定标识（用于持久化与缓存键） */
export function weekKey(weekStart: string, timeZone = DEFAULT_TIMEZONE): string {
  return `${weekStart}@${timeZone}`;
}
