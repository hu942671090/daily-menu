import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import {
  addDish,
  createWeekMenu,
  extractLockedRecipeIds,
  fillSlot,
  getDay,
  getRecipesInMenu,
  regenerateDay,
  regenerateSlot,
  removeDish,
  replaceDish,
  startOfWeekMonday,
  summarizeMenu,
  todayInTimeZone,
  toggleDishLock,
} from '@daily-menu/shared';
import type {
  DailyMenuRepository,
  FavoriteRecord,
  MealType,
  MenuSlotRef,
  Preferences,
  Recipe,
  RecipeVideo,
  WeekMenu,
} from '@daily-menu/shared';
import { RECIPES as LOCAL_RECIPES, VIDEOS as LOCAL_VIDEOS } from '@daily-menu/content';
import type { ContentBundle, DataSource } from './api';
import { loadContent } from './api';
import { repository } from './repository';
import { useToast } from '../components/Toast';

export interface AppActions {
  updatePreferences: (next: Preferences) => void;
  toggleFavorite: (recipeId: string) => void;
  selectWeek: (weekStart: string) => void;
  generateWeek: (weekStart: string, options?: { regenerate?: boolean }) => WeekMenu | null;
  regenerateWeek: () => void;
  regenerateMeal: (weekStart: string, date: string, meal: MealType) => void;
  regenerateDayOf: (weekStart: string, date: string) => void;
  swapDish: (weekStart: string, ref: MenuSlotRef) => void;
  replaceWith: (weekStart: string, ref: MenuSlotRef, recipeId: string, reasons?: string[]) => void;
  toggleLock: (weekStart: string, ref: MenuSlotRef) => void;
  removeDishAt: (weekStart: string, ref: MenuSlotRef) => void;
  addRecipeToMenu: (weekStart: string, date: string, meal: MealType, recipeId: string) => void;
  saveNow: (weekStart: string) => void;
  resetAll: () => void;
  loadShoppingChecks: (weekStart: string) => Record<string, boolean>;
  saveShoppingChecks: (weekStart: string, checks: Record<string, boolean>) => void;
  exportSnapshot: () => ReturnType<DailyMenuRepository['exportSnapshot']>;
}

export interface AppContextValue {
  ready: boolean;
  bootError: string | null;
  retryBoot: () => void;
  dataSource: DataSource;
  apiError?: string;
  recipes: Recipe[];
  videos: RecipeVideo[];
  preferences: Preferences;
  favorites: FavoriteRecord[];
  favoriteIds: Set<string>;
  today: string;
  currentWeekStart: string;
  activeWeekStart: string;
  activeMenu: WeekMenu | null;
  currentMenu: WeekMenu | null;
  actions: AppActions;
}

const AppContext = createContext<AppContextValue | null>(null);

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

/** 菜单生成时使用的偏好是否已与当前偏好不同 */
export function isMenuPreferencesStale(menu: WeekMenu, preferences: Preferences): boolean {
  return menu.preferences.updatedAt !== preferences.updatedAt;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [ready, setReady] = useState(false);
  const [bootError, setBootError] = useState<string | null>(null);
  const [bootToken, setBootToken] = useState(0);
  const [bundle, setBundle] = useState<ContentBundle | null>(null);
  const [preferences, setPreferences] = useState<Preferences>(() => repository.loadPreferences());
  const [favorites, setFavorites] = useState<FavoriteRecord[]>(() => repository.loadFavorites());
  const [menus, setMenus] = useState<Record<string, WeekMenu>>({});
  const [today, setToday] = useState<string>(() =>
    todayInTimeZone(repository.loadPreferences().timezone),
  );
  const [currentWeekStart, setCurrentWeekStart] = useState<string>(() =>
    startOfWeekMonday(todayInTimeZone(repository.loadPreferences().timezone)),
  );
  const [activeWeekStart, setActiveWeekStart] = useState<string>(() =>
    startOfWeekMonday(todayInTimeZone(repository.loadPreferences().timezone)),
  );

  const recipes = bundle?.recipes ?? LOCAL_RECIPES;
  const videos = bundle?.videos ?? LOCAL_VIDEOS;
  const dataSource: DataSource = bundle?.source ?? 'local';

  const retryBoot = useCallback(() => setBootToken((token) => token + 1), []);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setBootError(null);

    (async () => {
      try {
        const storedPreferences = repository.loadPreferences();
        const storedFavorites = repository.loadFavorites();
        const content = await loadContent();
        const timezone = storedPreferences.timezone;
        const day = todayInTimeZone(timezone);
        const weekStart = startOfWeekMonday(day);
        let menu = repository.loadMenu(weekStart);
        if (!menu) {
          if (content.recipes.length === 0) throw new Error('没有可用的菜谱数据');
          menu = createWeekMenu({
            weekStart,
            preferences: storedPreferences,
            recipes: content.recipes,
            timezone,
          });
          repository.saveMenu(menu);
        }
        if (cancelled) return;
        setPreferences(storedPreferences);
        setFavorites(storedFavorites);
        setBundle(content);
        setToday(day);
        setCurrentWeekStart(weekStart);
        setActiveWeekStart(weekStart);
        setMenus({ [weekStart]: menu });
        setReady(true);
      } catch (error) {
        if (cancelled) return;
        setBootError(error instanceof Error ? error.message : '初始化失败，请重试');
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [bootToken]);

  // 跨过零点时刷新「今天」，保证首页日期与菜单对应
  useEffect(() => {
    const timer = window.setInterval(() => {
      const next = todayInTimeZone(preferences.timezone);
      setToday((previous) => (previous === next ? previous : next));
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [preferences.timezone]);

  useEffect(() => {
    if (!ready || !bundle) return;
    const weekStart = startOfWeekMonday(today);
    setCurrentWeekStart(weekStart);
    if (menus[weekStart]) return;
    const stored = repository.loadMenu(weekStart);
    if (stored) {
      setMenus((previous) => ({ ...previous, [weekStart]: stored }));
      return;
    }
    const menu = createWeekMenu({
      weekStart,
      preferences,
      recipes: bundle.recipes,
      timezone: preferences.timezone,
    });
    repository.saveMenu(menu);
    setMenus((previous) => ({ ...previous, [weekStart]: menu }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today, ready, bundle]);

  const commitMenu = useCallback((menu: WeekMenu) => {
    const saved = repository.saveMenu(menu);
    setMenus((previous) => ({ ...previous, [saved.weekStart]: saved }));
    return saved;
  }, []);

  const regenerateFromPreferences = useCallback(
    (
      weekStart: string,
      mutate: (menu: WeekMenu) => WeekMenu,
      message: string,
    ) => {
      const existing = menus[weekStart];
      if (!existing) return;
      const next = mutate(existing);
      const withPreferences = { ...next, preferences: clonePreferences(preferences) };
      commitMenu(withPreferences);
      toast(message, 'success');
    },
    [menus, preferences, commitMenu, toast],
  );

  const updatePreferences = useCallback(
    (next: Preferences) => {
      const saved = repository.savePreferences(next);
      setPreferences(saved);
      setToday(todayInTimeZone(saved.timezone));
      setCurrentWeekStart(startOfWeekMonday(todayInTimeZone(saved.timezone)));
      toast('偏好已保存', 'success');
    },
    [toast],
  );

  const toggleFavorite = useCallback(
    (recipeId: string) => {
      const next = repository.toggleFavorite(recipeId);
      setFavorites(next);
      const added = next.some((record) => record.recipeId === recipeId);
      toast(added ? '已加入收藏' : '已取消收藏', 'success');
    },
    [toast],
  );

  const selectWeek = useCallback(
    (weekStart: string) => {
      const normalized = startOfWeekMonday(weekStart);
      setActiveWeekStart(normalized);
      if (menus[normalized]) return;
      const stored = repository.loadMenu(normalized);
      if (stored) setMenus((previous) => ({ ...previous, [normalized]: stored }));
    },
    [menus],
  );

  const generateWeek = useCallback(
    (weekStart: string, options: { regenerate?: boolean } = {}) => {
      if (!bundle) return null;
      const existing = menus[weekStart] ?? repository.loadMenu(weekStart);
      const lockedRecipeIds = existing ? extractLockedRecipeIds(existing) : {};
      const menu = createWeekMenu({
        weekStart,
        preferences,
        recipes: bundle.recipes,
        timezone: preferences.timezone,
        lockedRecipeIds,
        seed:
          options.regenerate || existing
            ? `${weekStart}|regen|${Date.now()}`
            : undefined,
      });
      commitMenu(menu);
      setActiveWeekStart(menu.weekStart);
      const lockedCount = Object.values(lockedRecipeIds).flat().length;
      toast(
        options.regenerate
          ? `已重新生成本周菜单${lockedCount > 0 ? `，保留 ${lockedCount} 道锁定的菜` : ''}`
          : '已生成这一周的菜单',
        'success',
      );
      return menu;
    },
    [bundle, menus, preferences, commitMenu, toast],
  );

  const regenerateWeek = useCallback(() => {
    generateWeek(activeWeekStart, { regenerate: true });
  }, [activeWeekStart, generateWeek]);

  const regenerateMeal = useCallback(
    (weekStart: string, date: string, meal: MealType) => {
      regenerateFromPreferences(weekStart, (menu) =>
        regenerateSlot(menu, { date, meal }, {
          recipes,
          preferences,
          seed: `${menu.id}|${date}|${meal}|${Date.now()}`,
        }),
      '这一餐已换新，锁定的菜保持不变');
    },
    [regenerateFromPreferences, recipes, preferences],
  );

  const regenerateDayOf = useCallback(
    (weekStart: string, date: string) => {
      regenerateFromPreferences(weekStart, (menu) =>
        regenerateDay(menu, date, {
          recipes,
          preferences,
          seed: `${menu.id}|${date}|${Date.now()}`,
        }),
      '这一天已重新安排');
    },
    [regenerateFromPreferences, recipes, preferences],
  );

  const swapDish = useCallback(
    (weekStart: string, ref: MenuSlotRef) => {
      const menu = menus[weekStart];
      if (!menu) return;
      const day = getDay(menu, ref.date);
      const dish = day?.meals[ref.meal][ref.index];
      if (!day || !dish) return;
      const sameSlot = day.meals[ref.meal].map((item) => item.recipeId);
      const weekRecipes = getRecipesInMenu(menu, recipes).filter(
        (recipe) => recipe.id !== dish.recipeId,
      );
      const result = fillSlot({
        recipes,
        preferences,
        meal: ref.meal,
        count: 1,
        weekRecipes,
        excludeRecipeIds: sameSlot,
        seed: `${menu.id}|swap|${ref.date}|${ref.meal}|${ref.index}|${Date.now()}`,
      });
      const pick = result.dishes[0];
      if (!pick) {
        toast('没有更多符合偏好的菜了，可以先放宽偏好设置', 'error');
        return;
      }
      const next = replaceDish(menu, ref, pick.recipe.id, { reasons: pick.reasons });
      commitMenu({ ...next, preferences: clonePreferences(preferences) });
      toast(`已换成「${pick.recipe.name}」`, 'success');
    },
    [menus, recipes, preferences, commitMenu, toast],
  );

  const replaceWith = useCallback(
    (weekStart: string, ref: MenuSlotRef, recipeId: string, reasons?: string[]) => {
      const menu = menus[weekStart];
      if (!menu) return;
      const next = replaceDish(menu, ref, recipeId, { reasons });
      commitMenu(next);
      toast('已替换这道菜', 'success');
    },
    [menus, commitMenu, toast],
  );

  const toggleLock = useCallback(
    (weekStart: string, ref: MenuSlotRef) => {
      const menu = menus[weekStart];
      if (!menu) return;
      const day = getDay(menu, ref.date);
      const dish = day?.meals[ref.meal][ref.index];
      if (!dish) return;
      const next = toggleDishLock(menu, ref);
      commitMenu(next);
      toast(dish.locked ? '已取消锁定' : '已锁定，重新生成时会保留', 'success');
    },
    [menus, commitMenu, toast],
  );

  const removeDishAt = useCallback(
    (weekStart: string, ref: MenuSlotRef) => {
      const menu = menus[weekStart];
      if (!menu) return;
      const next = removeDish(menu, ref);
      commitMenu(next);
      toast('已从菜单移除', 'success');
    },
    [menus, commitMenu, toast],
  );

  const addRecipeToMenu = useCallback(
    (weekStart: string, date: string, meal: MealType, recipeId: string) => {
      const menu = menus[weekStart];
      if (!menu) return;
      const next = addDish(menu, { date, meal }, recipeId);
      if (next === menu) {
        toast('这道菜已经在这一餐里了', 'error');
        return;
      }
      commitMenu(next);
      toast('已加入菜单', 'success');
    },
    [menus, commitMenu, toast],
  );

  const saveNow = useCallback(
    (weekStart: string) => {
      const menu = menus[weekStart];
      if (!menu) return;
      commitMenu(menu);
      toast('菜单已保存到本机，再次进入会自动恢复', 'success');
    },
    [menus, commitMenu, toast],
  );

  const resetAll = useCallback(() => {
    repository.reset();
    const storedPreferences = repository.loadPreferences();
    const day = todayInTimeZone(storedPreferences.timezone);
    const weekStart = startOfWeekMonday(day);
    const menu = createWeekMenu({
      weekStart,
      preferences: storedPreferences,
      recipes: bundle?.recipes ?? LOCAL_RECIPES,
      timezone: storedPreferences.timezone,
    });
    repository.saveMenu(menu);
    setPreferences(storedPreferences);
    setFavorites([]);
    setMenus({ [weekStart]: menu });
    setToday(day);
    setCurrentWeekStart(weekStart);
    setActiveWeekStart(weekStart);
    toast('已恢复默认设置并重新生成菜单', 'success');
  }, [bundle, toast]);

  const loadShoppingChecks = useCallback(
    (weekStart: string) => repository.loadShoppingChecks(weekStart),
    [],
  );

  const saveShoppingChecks = useCallback(
    (weekStart: string, checks: Record<string, boolean>) =>
      repository.saveShoppingChecks(weekStart, checks),
    [],
  );

  const exportSnapshot = useCallback(() => repository.exportSnapshot(), []);

  const activeMenu = menus[activeWeekStart] ?? null;
  const currentMenu = menus[currentWeekStart] ?? null;
  const favoriteIds = useMemo(
    () => new Set(favorites.map((record) => record.recipeId)),
    [favorites],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      bootError,
      retryBoot,
      dataSource,
      apiError: bundle?.error,
      recipes,
      videos,
      preferences,
      favorites,
      favoriteIds,
      today,
      currentWeekStart,
      activeWeekStart,
      activeMenu,
      currentMenu,
      actions: {
        updatePreferences,
        toggleFavorite,
        selectWeek,
        generateWeek,
        regenerateWeek,
        regenerateMeal,
        regenerateDayOf,
        swapDish,
        replaceWith,
        toggleLock,
        removeDishAt,
        addRecipeToMenu,
        saveNow,
        resetAll,
        loadShoppingChecks,
        saveShoppingChecks,
        exportSnapshot,
      },
    }),
    [
      ready,
      bootError,
      retryBoot,
      dataSource,
      bundle,
      recipes,
      videos,
      preferences,
      favorites,
      favoriteIds,
      today,
      currentWeekStart,
      activeWeekStart,
      activeMenu,
      currentMenu,
      updatePreferences,
      toggleFavorite,
      selectWeek,
      generateWeek,
      regenerateWeek,
      regenerateMeal,
      regenerateDayOf,
      swapDish,
      replaceWith,
      toggleLock,
      removeDishAt,
      addRecipeToMenu,
      saveNow,
      resetAll,
      loadShoppingChecks,
      saveShoppingChecks,
      exportSnapshot,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp 必须在 AppProvider 内使用');
  return context;
}
