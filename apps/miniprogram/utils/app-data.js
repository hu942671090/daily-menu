/**
 * 小程序数据访问层：所有页面通过这里复用与 Web 完全相同的推荐/菜单/存储逻辑。
 * 共享逻辑由 apps/miniprogram/scripts/build-data.mjs 从 packages/shared 打包而来。
 */
const bundle = require('../shared/bundle');
const config = require('../config/index');

function getRepository() {
  const app = getApp();
  if (!app.globalData.repository) {
    // onLaunch 未执行（例如单元调试）时的兜底
    app.globalData.repository = bundle.createStorageRepository(
      {
        getItem(key) {
          const value = wx.getStorageSync(key);
          return value === '' || value === undefined || value === null ? null : value;
        },
        setItem(key, value) {
          wx.setStorageSync(key, value);
        },
        removeItem(key) {
          wx.removeStorageSync(key);
        },
      },
      { defaultTimezone: config.defaultTimezone },
    );
  }
  return app.globalData.repository;
}

function assetUrl(src) {
  if (!src) return '';
  if (/^https?:\/\//.test(src)) return src;
  return `${config.assetBaseUrl}${src.startsWith('/') ? src : `/${src}`}`;
}

function getPreferences() {
  return getRepository().loadPreferences();
}

function getToday(preferences) {
  const prefs = preferences || getPreferences();
  return bundle.todayInTimeZone(prefs.timezone);
}

function favoriteIds() {
  return new Set(getRepository().loadFavorites().map((record) => record.recipeId));
}

function hasVerifiedVideo(recipeId) {
  return bundle
    .getVideosForRecipe(recipeId, bundle.VIDEOS)
    .some((video) => video.verification.status === 'verified');
}

function recipeMap() {
  const map = new Map();
  bundle.RECIPES.forEach((recipe) => map.set(recipe.id, recipe));
  return map;
}

function decorateRecipe(recipe, options) {
  const opts = options || {};
  const favorites = opts.favoriteIds || favoriteIds();
  const minutes = bundle.totalMinutes(recipe);
  return {
    id: recipe.id,
    name: recipe.name,
    subtitle: recipe.subtitle,
    cuisine: recipe.cuisine,
    image: assetUrl(recipe.image.src),
    imageAlt: recipe.image.alt,
    metaText: `${bundle.formatMinutes(minutes)} · ${bundle.DIFFICULTY_LABELS[recipe.difficulty]} · ${recipe.baseServings} 人份`,
    ingredientsText: recipe.mainIngredients.join(' · '),
    tastes: recipe.tastes,
    isFavorite: favorites.has(recipe.id),
    hasVideo: hasVerifiedVideo(recipe.id),
    showSwap: Boolean(opts.showSwap),
    meal: opts.meal || '',
    date: opts.date || '',
    index: typeof opts.index === 'number' ? opts.index : 0,
  };
}

function decorateDish(dish, index, meal, date, recipes) {
  const recipe = recipes.get(dish.recipeId);
  if (!recipe) {
    return {
      recipeId: dish.recipeId,
      name: '菜谱数据缺失',
      image: '',
      metaText: dish.recipeId,
      locked: dish.locked,
      index,
      meal,
      date,
      missing: true,
    };
  }
  return {
    recipeId: recipe.id,
    name: recipe.name,
    image: assetUrl(recipe.image.src),
    metaText: `${bundle.formatMinutes(bundle.totalMinutes(recipe))} · ${bundle.DIFFICULTY_LABELS[recipe.difficulty]}${hasVerifiedVideo(recipe.id) ? ' · 有视频' : ''}`,
    locked: dish.locked,
    index,
    meal,
    date,
    missing: false,
  };
}

function decorateDay(menu, date) {
  const recipes = recipeMap();
  const day = bundle.getDay(menu, date);
  return bundle.MEAL_ORDER.map((meal) => ({
    key: meal,
    label: bundle.MEAL_LABELS[meal],
    emoji: bundle.MEAL_EMOJI[meal],
    timeHint: bundle.MEAL_TIME_HINT[meal],
    dishes: day ? day.meals[meal].map((dish, index) => decorateDish(dish, index, meal, date, recipes)) : [],
  }));
}

function ensureCurrentMenu() {
  const preferences = getPreferences();
  const today = getToday(preferences);
  const weekStart = bundle.startOfWeekMonday(today);
  let menu = getRepository().loadMenu(weekStart);
  if (!menu) {
    menu = bundle.createWeekMenu({
      weekStart,
      preferences,
      recipes: bundle.RECIPES,
      timezone: preferences.timezone,
    });
    getRepository().saveMenu(menu);
  }
  return { preferences, today, weekStart, menu };
}

function saveMenu(menu) {
  return getRepository().saveMenu(menu);
}

function swapDish(menu, ref, preferences) {
  const day = bundle.getDay(menu, ref.date);
  if (!day) return { menu, changed: false };
  const dish = day.meals[ref.meal][ref.index];
  if (!dish) return { menu, changed: false };
  const sameSlot = day.meals[ref.meal].map((item) => item.recipeId);
  const weekRecipes = bundle
    .getRecipesInMenu(menu, bundle.RECIPES)
    .filter((recipe) => recipe.id !== dish.recipeId);
  const result = bundle.fillSlot({
    recipes: bundle.RECIPES,
    preferences,
    meal: ref.meal,
    count: 1,
    weekRecipes,
    excludeRecipeIds: sameSlot,
    seed: `${menu.id}|${ref.date}|${ref.meal}|${ref.index}|${Date.now()}`,
  });
  if (result.dishes.length === 0) return { menu, changed: false, empty: true };
  const next = bundle.replaceDish(menu, ref, result.dishes[0].recipe.id, {
    reasons: result.dishes[0].reasons,
  });
  return { menu: next, changed: true, name: result.dishes[0].recipe.name };
}

function regenerateMeal(menu, ref, preferences) {
  const next = bundle.regenerateSlot(menu, ref, {
    recipes: bundle.RECIPES,
    preferences,
    seed: `${menu.id}|${ref.date}|${ref.meal}|${Date.now()}`,
  });
  return next;
}

function regenerateWeek(menu, preferences, weekStart) {
  const locked = menu ? bundle.extractLockedRecipeIds(menu) : {};
  return bundle.createWeekMenu({
    weekStart,
    preferences,
    recipes: bundle.RECIPES,
    timezone: preferences.timezone,
    lockedRecipeIds: locked,
    seed: `${weekStart}|regen|${Date.now()}`,
  });
}

function weekLabel(weekStart) {
  return bundle.formatWeekRange(weekStart);
}

function weekDays(weekStart, today) {
  return bundle.weekDates(weekStart).map((date) => ({
    date,
    weekday: bundle.weekdayLabel(date, true),
    dayNumber: date.slice(8),
    isToday: date === today,
    label: bundle.formatChineseDate(date, false),
  }));
}

function videoModels(recipeId) {
  const videos = bundle.getVideosForRecipe(recipeId, bundle.VIDEOS);
  return videos.map((video) => ({
    id: video.id,
    platform: video.platform,
    platformLabel: video.platform === 'bilibili' ? 'bilibili' : '抖音',
    title: video.title,
    author: video.author,
    url: video.url,
    coverUrl: video.coverUrl || '',
    duration: bundle.formatVideoDuration ? bundle.formatVideoDuration(video.durationSec) : '',
    verified: video.verification.status === 'verified',
    statusLabel:
      video.verification.status === 'verified'
        ? '链接已核验'
        : video.verification.status === 'link-broken'
          ? '链接已失效'
          : '未核验',
    checkedAt: video.verification.checkedAt ? video.verification.checkedAt.slice(0, 10) : '未核验',
    note: video.verification.note || '',
  }));
}

function videoSearchLinks(recipe) {
  return bundle.getVideoSearchLinks(recipe).map((link) => ({
    platform: link.platform,
    label: link.label,
    url: link.url,
    note: link.note,
  }));
}

function toast(title, icon) {
  wx.showToast({ title, icon: icon || 'none', duration: 1800 });
}

function copyLink(url) {
  wx.setClipboardData({
    data: url,
    success: () => toast('链接已复制，请到浏览器打开'),
    fail: () => toast('复制失败，请重试'),
  });
}

function goRecipe(id) {
  wx.navigateTo({ url: `/pages/detail/index?id=${encodeURIComponent(id)}` });
}

function findRecipe(id) {
  return bundle.getRecipeById(id, bundle.RECIPES);
}

module.exports = {
  bundle,
  config,
  assetUrl,
  getRepository,
  getPreferences,
  getToday,
  favoriteIds,
  decorateRecipe,
  decorateDay,
  ensureCurrentMenu,
  saveMenu,
  swapDish,
  regenerateMeal,
  regenerateWeek,
  weekLabel,
  weekDays,
  videoModels,
  videoSearchLinks,
  toast,
  copyLink,
  goRecipe,
  findRecipe,
  hasVerifiedVideo,
  recipeMap,
};
