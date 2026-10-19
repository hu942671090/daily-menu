const appData = require('../../utils/app-data');

const { bundle } = appData;

Page({
  data: {
    ready: false,
    weekStart: '',
    weekLabel: '',
    servings: 2,
    mainItems: [],
    seasoningItems: [],
    stats: { total: 0, checked: 0, completion: 0 },
    days: 0,
  },

  onLoad(options) {
    this.initialWeekStart = options.weekStart || '';
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    try {
      const preferences = appData.getPreferences();
      const today = appData.getToday(preferences);
      const weekStart = this.initialWeekStart || bundle.startOfWeekMonday(today);
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
      const checks = appData.getRepository().loadShoppingChecks(weekStart);
      const items = bundle.buildShoppingList(menu, {
        recipes: bundle.RECIPES,
        servings: preferences.servings,
        checks,
      });
      const decorate = (item) => ({
        key: item.key,
        name: item.name,
        amountText:
          item.amount !== null
            ? `${bundle.formatNumber(item.amount)} ${item.unit}`
            : item.textAmounts.join(' / '),
        checked: item.checked,
        recipeCount: item.recipeIds.length,
      });
      const mainItems = items.filter((item) => item.group === 'main').map(decorate);
      const seasoningItems = items.filter((item) => item.group === 'seasoning').map(decorate);
      const stats = bundle.shoppingStats(items);
      this.currentItems = items;
      this.weekStart = weekStart;
      this.setData({
        ready: true,
        weekStart,
        weekLabel: bundle.formatWeekRange(weekStart),
        servings: preferences.servings,
        mainItems,
        seasoningItems,
        stats: { total: stats.total, checked: stats.checked, completion: stats.completion },
        days: menu.days.length,
      });
    } catch (error) {
      console.error('[shopping] 加载失败', error);
      this.setData({ ready: true });
      appData.toast('购物清单加载失败');
    }
  },

  onToggle(event) {
    const key = event.currentTarget.dataset.key;
    const checks = appData.getRepository().loadShoppingChecks(this.weekStart);
    checks[key] = !checks[key];
    appData.getRepository().saveShoppingChecks(this.weekStart, checks);
    this.refresh();
  },

  onCopy() {
    const items = this.currentItems || [];
    if (items.length === 0) {
      appData.toast('清单还是空的');
      return;
    }
    const lines = [`今天吃什么 · 购物清单`, `${this.data.weekLabel} · ${this.data.servings} 人份`, ''];
    const render = (label, list) => {
      if (list.length === 0) return;
      lines.push(`【${label}】`);
      list.forEach((item) => {
        lines.push(
          `- ${item.name} ${
            item.amount !== null
              ? `${bundle.formatNumber(item.amount)} ${item.unit}`
              : item.textAmounts.join(' / ')
          }`,
        );
      });
      lines.push('');
    };
    render('主料', items.filter((item) => item.group === 'main'));
    render('调料', items.filter((item) => item.group === 'seasoning'));
    wx.setClipboardData({
      data: lines.join('\n'),
      success: () => appData.toast('购物清单已复制'),
      fail: () => appData.toast('复制失败，请重试'),
    });
  },

  onResetChecks() {
    appData.getRepository().saveShoppingChecks(this.weekStart, {});
    this.refresh();
    appData.toast('已清空勾选');
  },

  goWeek() {
    wx.switchTab({ url: '/pages/week/index' });
  },
});
