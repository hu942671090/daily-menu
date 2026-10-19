const appData = require('../../utils/app-data');

const { bundle } = appData;

const TIME_OPTIONS = [15, 30, 45, 60];

Page({
  data: {
    ready: false,
    keyword: '',
    meals: [],
    maxMinutes: 0,
    difficulties: [],
    timeOptions: TIME_OPTIONS,
    results: [],
    total: 0,
    activeFilterCount: 0,
    mealOptions: [
      { key: 'breakfast', label: '早餐' },
      { key: 'lunch', label: '午餐' },
      { key: 'dinner', label: '晚餐' },
    ],
    difficultyOptions: [
      { value: 1, label: '简单' },
      { value: 2, label: '中等' },
      { value: 3, label: '进阶' },
    ],
  },

  onShow() {
    this.apply();
  },

  onInput(event) {
    const keyword = event.detail.value;
    this.setData({ keyword });
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.apply(), 260);
  },

  onConfirm() {
    this.apply();
  },

  toggleMeal(event) {
    const meal = event.currentTarget.dataset.key;
    const meals = this.data.meals.includes(meal)
      ? this.data.meals.filter((item) => item !== meal)
      : [...this.data.meals, meal];
    this.setData({ meals });
    this.apply();
  },

  toggleTime(event) {
    const value = Number(event.currentTarget.dataset.value);
    this.setData({ maxMinutes: this.data.maxMinutes === value ? 0 : value });
    this.apply();
  },

  toggleDifficulty(event) {
    const value = Number(event.currentTarget.dataset.value);
    const difficulties = this.data.difficulties.includes(value)
      ? this.data.difficulties.filter((item) => item !== value)
      : [...this.data.difficulties, value];
    this.setData({ difficulties });
    this.apply();
  },

  onReset() {
    this.setData({ keyword: '', meals: [], maxMinutes: 0, difficulties: [] });
    this.apply();
  },

  apply() {
    try {
      const favorites = appData.favoriteIds();
      const recipes = bundle.searchRecipes(
        {
          q: this.data.keyword.trim(),
          meals: this.data.meals.length > 0 ? this.data.meals : undefined,
          maxMinutes: this.data.maxMinutes || undefined,
          difficulties: this.data.difficulties.length > 0 ? this.data.difficulties : undefined,
          limit: 60,
        },
        bundle.RECIPES,
        bundle.VIDEOS,
      );
      const activeFilterCount =
        this.data.meals.length + this.data.difficulties.length + (this.data.maxMinutes ? 1 : 0);
      this.setData({
        ready: true,
        total: recipes.length,
        activeFilterCount,
        results: recipes.map((recipe) => appData.decorateRecipe(recipe, { favoriteIds: favorites })),
      });
    } catch (error) {
      console.error('[discover] 搜索失败', error);
      appData.toast('搜索失败，请重试');
    }
  },

  onOpen(event) {
    appData.goRecipe(event.currentTarget.dataset.id);
  },

  onFavorite(event) {
    appData.getRepository().toggleFavorite(event.currentTarget.dataset.id);
    this.apply();
    appData.toast('收藏状态已更新');
  },

  onSwap() {},
});
