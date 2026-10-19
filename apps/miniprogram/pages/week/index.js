const appData = require('../../utils/app-data');

const { bundle } = appData;

Page({
  data: {
    ready: false,
    weekStart: '',
    weekLabel: '',
    isCurrentWeek: true,
    today: '',
    selectedDate: '',
    selectedLabel: '',
    days: [],
    meals: [],
    hasMenu: false,
    summary: { dishCount: 0, uniqueRecipeCount: 0, averageMinutes: 0 },
    lockedCount: 0,
  },

  onShow() {
    this.refresh();
  },

  refresh(weekStartArg) {
    try {
      const preferences = appData.getPreferences();
      const today = appData.getToday(preferences);
      const currentWeekStart = bundle.startOfWeekMonday(today);
      const weekStart = weekStartArg || this.data.weekStart || currentWeekStart;
      const menu = appData.getRepository().loadMenu(weekStart);
      const days = appData.weekDays(weekStart, today);

      let selectedDate = this.data.selectedDate;
      if (!days.some((day) => day.date === selectedDate)) {
        selectedDate = days.some((day) => day.date === today) ? today : weekStart;
      }

      const meals = menu ? appData.decorateDay(menu, selectedDate) : [];
      const summary = menu ? bundle.summarizeMenu(menu, bundle.RECIPES) : null;
      let lockedCount = 0;
      if (menu) {
        menu.days.forEach((day) => {
          bundle.MEAL_ORDER.forEach((meal) => {
            lockedCount += day.meals[meal].filter((dish) => dish.locked).length;
          });
        });
      }

      this.setData({
        ready: true,
        weekStart,
        weekLabel: bundle.formatWeekRange(weekStart),
        isCurrentWeek: weekStart === currentWeekStart,
        today,
        selectedDate,
        selectedLabel: bundle.formatChineseDate(selectedDate),
        days,
        meals,
        hasMenu: Boolean(menu),
        summary: summary
          ? {
              dishCount: summary.dishCount,
              uniqueRecipeCount: summary.uniqueRecipeCount,
              averageMinutes: summary.averageMinutes,
            }
          : { dishCount: 0, uniqueRecipeCount: 0, averageMinutes: 0 },
        lockedCount,
      });
    } catch (error) {
      console.error('[week] 加载失败', error);
      this.setData({ ready: true });
      appData.toast('菜单加载失败');
    }
  },

  onPrevWeek() {
    this.setData({ selectedDate: '' });
    this.refresh(bundle.shiftWeek(this.data.weekStart, -1));
  },

  onNextWeek() {
    this.setData({ selectedDate: '' });
    this.refresh(bundle.shiftWeek(this.data.weekStart, 1));
  },

  onTodayWeek() {
    const preferences = appData.getPreferences();
    const today = appData.getToday(preferences);
    this.setData({ selectedDate: today });
    this.refresh(bundle.startOfWeekMonday(today));
  },

  onSelectDay(event) {
    const date = event.currentTarget.dataset.date;
    const menu = appData.getRepository().loadMenu(this.data.weekStart);
    this.setData({
      selectedDate: date,
      selectedLabel: bundle.formatChineseDate(date),
      meals: menu ? appData.decorateDay(menu, date) : [],
    });
  },

  onGenerate() {
    try {
      const preferences = appData.getPreferences();
      const menu = bundle.createWeekMenu({
        weekStart: this.data.weekStart,
        preferences,
        recipes: bundle.RECIPES,
        timezone: preferences.timezone,
      });
      appData.saveMenu(menu);
      this.refresh(menu.weekStart);
      appData.toast('已生成本周菜单');
    } catch (error) {
      console.error('[week] 生成失败', error);
      appData.toast('生成失败，请重试');
    }
  },

  onRegenerateWeek() {
    wx.showModal({
      title: '重新生成本周菜单？',
      content:
        this.data.lockedCount > 0
          ? `已锁定的 ${this.data.lockedCount} 道菜会保留，其余安排会重新推荐。`
          : '未锁定的安排会被替换。建议先锁定喜欢的菜。',
      confirmText: '重新生成',
      confirmColor: '#2F7A57',
      success: (result) => {
        if (!result.confirm) return;
        const preferences = appData.getPreferences();
        const menu = appData.getRepository().loadMenu(this.data.weekStart);
        const next = appData.regenerateWeek(menu, preferences, this.data.weekStart);
        appData.saveMenu(next);
        this.refresh(this.data.weekStart);
        appData.toast('已重新生成，锁定的菜已保留');
      },
    });
  },

  onRegenerateMeal(event) {
    const { date, meal } = event.currentTarget.dataset;
    const preferences = appData.getPreferences();
    const menu = appData.getRepository().loadMenu(this.data.weekStart);
    if (!menu) return;
    const next = appData.regenerateMeal(menu, { date, meal }, preferences);
    appData.saveMenu(next);
    this.refresh(this.data.weekStart);
    this.setData({
      selectedDate: date,
      selectedLabel: bundle.formatChineseDate(date),
      meals: appData.decorateDay(next, date),
    });
    appData.toast('这一餐已换新');
  },

  onToggleLock(event) {
    const { date, meal, index } = event.currentTarget.dataset;
    const menu = appData.getRepository().loadMenu(this.data.weekStart);
    if (!menu) return;
    const next = bundle.toggleDishLock(menu, { date, meal, index: Number(index) });
    appData.saveMenu(next);
    this.refresh(this.data.weekStart);
    const updated = appData.getRepository().loadMenu(this.data.weekStart);
    this.setData({ meals: updated ? appData.decorateDay(updated, this.data.selectedDate) : [] });
    appData.toast('锁定状态已更新');
  },

  onSwapDish(event) {
    const { date, meal, index } = event.currentTarget.dataset;
    const preferences = appData.getPreferences();
    const menu = appData.getRepository().loadMenu(this.data.weekStart);
    if (!menu) return;
    const result = appData.swapDish(menu, { date, meal, index: Number(index) }, preferences);
    if (!result.changed) {
      appData.toast(result.empty ? '没有更多符合偏好的菜了' : '暂时无法替换');
      return;
    }
    appData.saveMenu(result.menu);
    this.setData({ meals: appData.decorateDay(result.menu, this.data.selectedDate) });
    this.refresh(this.data.weekStart);
    appData.toast(`已换成「${result.name}」`);
  },

  onOpenDish(event) {
    appData.goRecipe(event.currentTarget.dataset.id);
  },

  onSave() {
    const menu = appData.getRepository().loadMenu(this.data.weekStart);
    if (!menu) return;
    appData.saveMenu(menu);
    appData.toast('菜单已保存到本机');
  },

  goShopping() {
    wx.navigateTo({ url: `/pages/shopping/index?weekStart=${this.data.weekStart}` });
  },
});
