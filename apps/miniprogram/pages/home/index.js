const appData = require('../../utils/app-data');

const { bundle } = appData;

Page({
  data: {
    ready: false,
    today: '',
    todayLabel: '',
    weekLabel: '',
    servings: 2,
    timezone: 'Asia/Shanghai',
    meals: [],
    summary: { dishCount: 0, uniqueRecipeCount: 0, averageMinutes: 0 },
    favoriteCount: 0,
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    try {
      const preferences = appData.getPreferences();
      const today = appData.getToday(preferences);
      const weekStart = bundle.startOfWeekMonday(today);
      let menu = appData.getRepository().loadMenu(weekStart);
      if (!menu) {
        menu = bundle.createWeekMenu({
          weekStart,
          preferences,
          recipes: bundle.RECIPES,
          timezone: preferences.timezone,
        });
        appData.saveMenu(menu);
      }
      const favorites = appData.favoriteIds();
      const meals = appData.decorateDay(menu, today).map((meal) => ({
        ...meal,
        cards: meal.dishes
          .map((dish) => {
            const recipe = appData.findRecipe(dish.recipeId);
            if (!recipe) return null;
            return appData.decorateRecipe(recipe, {
              showSwap: true,
              meal: meal.key,
              date: today,
              index: dish.index,
              favoriteIds: favorites,
            });
          })
          .filter(Boolean),
      }));
      const summary = bundle.summarizeMenu(menu, bundle.RECIPES);
      this.setData({
        ready: true,
        today,
        todayLabel: bundle.formatChineseDate(today),
        weekLabel: bundle.formatWeekRange(weekStart),
        servings: preferences.servings,
        timezone: preferences.timezone,
        meals,
        summary: {
          dishCount: summary.dishCount,
          uniqueRecipeCount: summary.uniqueRecipeCount,
          averageMinutes: summary.averageMinutes,
        },
        favoriteCount: favorites.size,
      });
    } catch (error) {
      console.error('[home] 加载失败', error);
      this.setData({ ready: true });
      appData.toast('加载失败，请下拉重试');
    }
  },

  onPullDownRefresh() {
    this.refresh();
    wx.stopPullDownRefresh();
  },

  onOpen(event) {
    appData.goRecipe(event.currentTarget.dataset.id);
  },

  onFavorite(event) {
    const id = event.currentTarget.dataset.id;
    appData.getRepository().toggleFavorite(id);
    this.refresh();
    appData.toast('收藏状态已更新');
  },

  onSwap(event) {
    const { date, meal, index } = event.currentTarget.dataset;
    const preferences = appData.getPreferences();
    const menu = appData.getRepository().loadMenu(bundle.startOfWeekMonday(date));
    if (!menu) return;
    const result = appData.swapDish(
      menu,
      { date, meal, index: Number(index) },
      preferences,
    );
    if (!result.changed) {
      appData.toast(result.empty ? '没有更多符合偏好的菜了' : '暂时无法替换');
      return;
    }
    appData.saveMenu(result.menu);
    this.refresh();
    appData.toast(`已换成「${result.name}」`);
  },

  onRegenerateMeal(event) {
    const { date, meal } = event.currentTarget.dataset;
    const preferences = appData.getPreferences();
    const menu = appData.getRepository().loadMenu(bundle.startOfWeekMonday(date));
    if (!menu) return;
    const next = appData.regenerateMeal(menu, { date, meal }, preferences);
    appData.saveMenu(next);
    this.refresh();
    appData.toast('这一餐已换新，锁定的菜保留');
  },

  goWeek() {
    wx.switchTab({ url: '/pages/week/index' });
  },

  goShopping() {
    wx.navigateTo({ url: '/pages/shopping/index' });
  },

  goPreferences() {
    wx.switchTab({ url: '/pages/preferences/index' });
  },

  goDiscover() {
    wx.switchTab({ url: '/pages/discover/index' });
  },
});
