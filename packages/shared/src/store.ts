/**
 * 本地持久化：Web 使用 localStorage，小程序使用 wx.getStorageSync 适配器。
 *
 * 存储结构（带版本前缀，便于后续迁移）：
 *   dm.v1.preferences   Preferences
 *   dm.v1.favorites     FavoriteRecord[]
 *   dm.v1.menus         Record<weekStart, WeekMenu>
 *   dm.v1.shopping      Record<weekStart, Record<itemKey, boolean>>
 *   dm.v1.meta          { schemaVersion, installedAt, lastOpenedAt }
 *
 * 账号与跨端同步：实现 sync.ts 中的 AccountSyncAdapter 即可接入，当前不启用。
 */
import {
  CUISINES,
  DEFAULT_PREFERENCES,
  DEFAULT_TIMEZONE,
  MAX_SERVINGS,
  MIN_SERVINGS,
  SCHEMA_VERSION,
  STORAGE_KEYS,
  TASTE_TAGS,
} from './constants';
import { isDateString, isValidTimeZone, startOfWeekMonday, weekDates } from './date';
import type {
  Cuisine,
  DayMenu,
  Difficulty,
  FavoriteRecord,
  MealType,
  MenuDish,
  Preferences,
  TasteTag,
  WeekMenu,
} from './types';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** 测试与小程序 SSR 场景使用的内存实现 */
export class MemoryStorage implements StorageLike {
  private readonly data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
  }
}

export interface ShoppingCheckMap {
  [weekStart: string]: Record<string, boolean>;
}

export interface PersistedSnapshot {
  schemaVersion: number;
  exportedAt: string;
  preferences: Preferences;
  favorites: FavoriteRecord[];
  menus: Record<string, WeekMenu>;
  shopping: ShoppingCheckMap;
}

export interface DailyMenuRepository {
  loadPreferences(): Preferences;
  savePreferences(preferences: Preferences): Preferences;
  loadFavorites(): FavoriteRecord[];
  isFavorite(recipeId: string): boolean;
  toggleFavorite(recipeId: string): FavoriteRecord[];
  loadMenu(weekStart: string): WeekMenu | null;
  saveMenu(menu: WeekMenu): WeekMenu;
  listSavedWeeks(): string[];
  deleteMenu(weekStart: string): void;
  loadShoppingChecks(weekStart: string): Record<string, boolean>;
  saveShoppingChecks(weekStart: string, checks: Record<string, boolean>): void;
  exportSnapshot(): PersistedSnapshot;
  importSnapshot(snapshot: PersistedSnapshot): void;
  reset(): void;
}

export interface RepositoryOptions {
  now?: () => Date;
  defaultTimezone?: string;
}

const MAX_LIST_LENGTH = 40;

function asStringArray(value: unknown, allowed?: readonly string[]): string[] {
  if (!Array.isArray(value)) return [];
  const result: string[] = [];
  for (const entry of value) {
    if (typeof entry !== 'string') continue;
    const trimmed = entry.trim();
    if (!trimmed) continue;
    if (allowed && !allowed.includes(trimmed)) continue;
    if (!result.includes(trimmed)) result.push(trimmed);
    if (result.length >= MAX_LIST_LENGTH) break;
  }
  return result;
}

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.round(number)));
}

export function sanitizePreferences(
  input: unknown,
  defaults: Preferences = DEFAULT_PREFERENCES,
  defaultTimezone = DEFAULT_TIMEZONE,
): Preferences {
  const raw = (input && typeof input === 'object' ? input : {}) as Partial<Preferences>;
  const difficulties = Array.isArray(raw.difficulties)
    ? (raw.difficulties.filter((item) => item === 1 || item === 2 || item === 3) as Difficulty[])
    : [];
  return {
    servings: clampInt(raw.servings, MIN_SERVINGS, MAX_SERVINGS, defaults.servings),
    cuisines: asStringArray(raw.cuisines, CUISINES) as Cuisine[],
    tastes: asStringArray(raw.tastes, TASTE_TAGS) as TasteTag[],
    avoidIngredients: asStringArray(raw.avoidIngredients),
    allergens: asStringArray(raw.allergens),
    dislikedIngredients: asStringArray(raw.dislikedIngredients),
    maxCookMinutes: clampInt(raw.maxCookMinutes, 10, 240, defaults.maxCookMinutes),
    difficulties: [...new Set(difficulties)],
    timezone:
      typeof raw.timezone === 'string' && isValidTimeZone(raw.timezone)
        ? raw.timezone
        : defaultTimezone,
    schemaVersion: SCHEMA_VERSION,
    updatedAt:
      typeof raw.updatedAt === 'string' && raw.updatedAt.length > 0
        ? raw.updatedAt
        : defaults.updatedAt,
  };
}

export function createDefaultPreferences(timezone = DEFAULT_TIMEZONE): Preferences {
  return { ...DEFAULT_PREFERENCES, timezone: isValidTimeZone(timezone) ? timezone : DEFAULT_TIMEZONE };
}

const MEALS: MealType[] = ['breakfast', 'lunch', 'dinner'];

function sanitizeDish(raw: unknown): MenuDish | null {
  if (!raw || typeof raw !== 'object') return null;
  const dish = raw as Partial<MenuDish>;
  if (typeof dish.recipeId !== 'string' || !dish.recipeId) return null;
  return {
    recipeId: dish.recipeId,
    locked: Boolean(dish.locked),
    origin: dish.origin === 'manual' ? 'manual' : 'generated',
    addedAt: typeof dish.addedAt === 'string' ? dish.addedAt : new Date(0).toISOString(),
    ...(Array.isArray(dish.reasons)
      ? { reasons: dish.reasons.filter((reason): reason is string => typeof reason === 'string').slice(0, 4) }
      : {}),
  };
}

export function sanitizeMenu(raw: unknown): WeekMenu | null {
  if (!raw || typeof raw !== 'object') return null;
  const menu = raw as Partial<WeekMenu>;
  if (!isDateString(menu.weekStart)) return null;
  const weekStart = startOfWeekMonday(menu.weekStart);
  const rawDays = Array.isArray(menu.days) ? menu.days : [];
  const days: DayMenu[] = weekDates(weekStart).map((date) => {
    const existing = rawDays.find((day) => day && day.date === date);
    const meals = {} as DayMenu['meals'];
    for (const meal of MEALS) {
      const dishes = Array.isArray(existing?.meals?.[meal]) ? existing.meals[meal] : [];
      meals[meal] = dishes
        .map(sanitizeDish)
        .filter((dish): dish is MenuDish => dish !== null);
    }
    return { date, meals };
  });
  return {
    id: typeof menu.id === 'string' && menu.id ? menu.id : `menu:${menu.timezone ?? DEFAULT_TIMEZONE}:${weekStart}`,
    weekStart,
    timezone: isValidTimeZone(menu.timezone ?? '') ? (menu.timezone as string) : DEFAULT_TIMEZONE,
    days,
    strategy: typeof menu.strategy === 'string' ? menu.strategy : 'rules-v1',
    preferences: sanitizePreferences(menu.preferences),
    generatedAt: typeof menu.generatedAt === 'string' ? menu.generatedAt : new Date(0).toISOString(),
    updatedAt: typeof menu.updatedAt === 'string' ? menu.updatedAt : new Date(0).toISOString(),
    schemaVersion: SCHEMA_VERSION,
  };
}

function sanitizeFavorites(raw: unknown): FavoriteRecord[] {
  if (!Array.isArray(raw)) return [];
  const result: FavoriteRecord[] = [];
  const seen = new Set<string>();
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue;
    const record = entry as Partial<FavoriteRecord>;
    if (typeof record.recipeId !== 'string' || !record.recipeId) continue;
    if (seen.has(record.recipeId)) continue;
    seen.add(record.recipeId);
    result.push({
      recipeId: record.recipeId,
      createdAt: typeof record.createdAt === 'string' ? record.createdAt : new Date(0).toISOString(),
    });
  }
  return result;
}

export function createStorageRepository(
  storage: StorageLike,
  options: RepositoryOptions = {},
): DailyMenuRepository {
  const now = options.now ?? (() => new Date());
  const timezone = options.defaultTimezone ?? DEFAULT_TIMEZONE;

  const readJson = (key: string): unknown => {
    try {
      const raw = storage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as unknown;
    } catch {
      return null;
    }
  };

  const writeJson = (key: string, value: unknown): void => {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch {
      // 存储空间不足或隐私模式禁用时静默失败，避免阻断页面
    }
  };

  const readMenus = (): Record<string, WeekMenu> => {
    const raw = readJson(STORAGE_KEYS.menus);
    if (!raw || typeof raw !== 'object') return {};
    const result: Record<string, WeekMenu> = {};
    for (const value of Object.values(raw as Record<string, unknown>)) {
      const menu = sanitizeMenu(value);
      if (menu) result[menu.weekStart] = menu;
    }
    return result;
  };

  const readFavorites = (): FavoriteRecord[] => sanitizeFavorites(readJson(STORAGE_KEYS.favorites));

  return {
    loadPreferences(): Preferences {
      return sanitizePreferences(readJson(STORAGE_KEYS.preferences), createDefaultPreferences(timezone), timezone);
    },

    savePreferences(preferences: Preferences): Preferences {
      const sanitized = sanitizePreferences(preferences, createDefaultPreferences(timezone), timezone);
      const next = { ...sanitized, updatedAt: now().toISOString(), schemaVersion: SCHEMA_VERSION };
      writeJson(STORAGE_KEYS.preferences, next);
      return next;
    },

    loadFavorites(): FavoriteRecord[] {
      return readFavorites();
    },

    isFavorite(recipeId: string): boolean {
      return readFavorites().some((record) => record.recipeId === recipeId);
    },

    toggleFavorite(recipeId: string): FavoriteRecord[] {
      const current = readFavorites();
      const exists = current.some((record) => record.recipeId === recipeId);
      const next = exists
        ? current.filter((record) => record.recipeId !== recipeId)
        : [...current, { recipeId, createdAt: now().toISOString() }];
      writeJson(STORAGE_KEYS.favorites, next);
      return next;
    },

    loadMenu(weekStart: string): WeekMenu | null {
      const normalized = startOfWeekMonday(weekStart);
      const menus = readMenus();
      return menus[normalized] ?? null;
    },

    saveMenu(menu: WeekMenu): WeekMenu {
      const sanitized = sanitizeMenu(menu);
      if (!sanitized) return menu;
      const menus = readMenus();
      menus[sanitized.weekStart] = sanitized;
      writeJson(STORAGE_KEYS.menus, menus);
      return sanitized;
    },

    listSavedWeeks(): string[] {
      return Object.keys(readMenus()).sort((left, right) => right.localeCompare(left));
    },

    deleteMenu(weekStart: string): void {
      const normalized = startOfWeekMonday(weekStart);
      const menus = readMenus();
      if (!(normalized in menus)) return;
      delete menus[normalized];
      writeJson(STORAGE_KEYS.menus, menus);
    },

    loadShoppingChecks(weekStart: string): Record<string, boolean> {
      const raw = readJson(STORAGE_KEYS.shopping);
      if (!raw || typeof raw !== 'object') return {};
      const bucket = (raw as ShoppingCheckMap)[startOfWeekMonday(weekStart)];
      if (!bucket || typeof bucket !== 'object') return {};
      const result: Record<string, boolean> = {};
      for (const [key, value] of Object.entries(bucket)) {
        if (typeof value === 'boolean') result[key] = value;
      }
      return result;
    },

    saveShoppingChecks(weekStart: string, checks: Record<string, boolean>): void {
      const raw = readJson(STORAGE_KEYS.shopping);
      const all: ShoppingCheckMap = raw && typeof raw === 'object' ? (raw as ShoppingCheckMap) : {};
      all[startOfWeekMonday(weekStart)] = checks;
      writeJson(STORAGE_KEYS.shopping, all);
    },

    exportSnapshot(): PersistedSnapshot {
      return {
        schemaVersion: SCHEMA_VERSION,
        exportedAt: now().toISOString(),
        preferences: sanitizePreferences(readJson(STORAGE_KEYS.preferences), createDefaultPreferences(timezone), timezone),
        favorites: readFavorites(),
        menus: readMenus(),
        shopping: (readJson(STORAGE_KEYS.shopping) as ShoppingCheckMap) ?? {},
      };
    },

    importSnapshot(snapshot: PersistedSnapshot): void {
      const menus: Record<string, WeekMenu> = {};
      for (const value of Object.values(snapshot.menus ?? {})) {
        const menu = sanitizeMenu(value);
        if (menu) menus[menu.weekStart] = menu;
      }
      writeJson(STORAGE_KEYS.preferences, sanitizePreferences(snapshot.preferences, createDefaultPreferences(timezone), timezone));
      writeJson(STORAGE_KEYS.favorites, sanitizeFavorites(snapshot.favorites));
      writeJson(STORAGE_KEYS.menus, menus);
      writeJson(STORAGE_KEYS.shopping, snapshot.shopping ?? {});
    },

    reset(): void {
      for (const key of Object.values(STORAGE_KEYS)) {
        try {
          storage.removeItem(key);
        } catch {
          // ignore
        }
      }
      writeJson(STORAGE_KEYS.meta, {
        schemaVersion: SCHEMA_VERSION,
        installedAt: now().toISOString(),
        lastOpenedAt: now().toISOString(),
      });
    },
  };
}

export function touchMeta(storage: StorageLike, now: Date = new Date()): void {
  try {
    const raw = storage.getItem(STORAGE_KEYS.meta);
    const existing = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    storage.setItem(
      STORAGE_KEYS.meta,
      JSON.stringify({
        schemaVersion: SCHEMA_VERSION,
        installedAt: typeof existing.installedAt === 'string' ? existing.installedAt : now.toISOString(),
        lastOpenedAt: now.toISOString(),
      }),
    );
  } catch {
    // ignore
  }
}
