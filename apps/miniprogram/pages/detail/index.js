const appData = require('../../utils/app-data');

const { bundle } = appData;

Page({
  data: {
    ready: false,
    missing: false,
    recipe: null,
    servings: 2,
    groups: [],
    steps: [],
    videos: [],
    searchLinks: [],
    verifiedCount: 0,
    isFavorite: false,
  },

  onLoad(options) {
    const id = decodeURIComponent(options.id || '');
    const recipe = appData.findRecipe(id);
    if (!recipe) {
      this.setData({ ready: true, missing: true });
      return;
    }
    const preferences = appData.getPreferences();
    this.recipeId = id;
    this.setData({ servings: preferences.servings });
    this.load(recipe, preferences.servings);
  },

  load(recipe, servings) {
    const groups = recipe.ingredientGroups.map((group) => ({
      id: group.id,
      title: group.title,
      items: group.items.map((item) => {
        const scaled = bundle.scaleIngredient(item, servings, recipe.baseServings);
        return {
          id: item.id,
          name: item.name,
          note: item.note || '',
          amountText: scaled.amountText,
          textMode: scaled.amount === null,
        };
      }),
    }));

    const steps = recipe.steps.map((step) => ({
      index: step.index,
      title: step.title,
      text: step.text,
      heat: step.heat || '',
      timeHint: step.timeHint || '',
      image: appData.assetUrl(step.image.src),
      imageNote: step.image.note || '示意图，非实拍',
    }));

    const videos = appData.videoModels(recipe.id);
    const recipeModel = {
      id: recipe.id,
      name: recipe.name,
      subtitle: recipe.subtitle,
      intro: recipe.intro,
      cuisine: recipe.cuisine,
      tastesText: recipe.tastes.join(' · '),
      mealText: recipe.mealTypes.map((meal) => bundle.MEAL_LABELS[meal]).join(' / '),
      image: appData.assetUrl(recipe.image.src),
      imageAlt: recipe.image.alt,
      imageNote: recipe.image.note || '示意图，非实拍',
      totalText: bundle.formatMinutes(bundle.totalMinutes(recipe)),
      prepMinutes: recipe.prepMinutes,
      cookMinutes: recipe.cookMinutes,
      difficultyLabel: bundle.DIFFICULTY_LABELS[recipe.difficulty],
      baseServings: recipe.baseServings,
      tips: recipe.tips,
      substitutions: recipe.substitutions,
      failures: recipe.failures,
      sourceLabel: recipe.source.label,
      sourceLicense: recipe.source.license || '',
      sourceNote: recipe.source.note || '',
      completeness: recipe.completeness,
      completenessNote: recipe.completenessNote || '',
    };

    this.recipe = recipe;
    this.setData({
      ready: true,
      missing: false,
      recipe: recipeModel,
      groups,
      steps,
      videos,
      searchLinks: appData.videoSearchLinks(recipe),
      verifiedCount: videos.filter((video) => video.verified).length,
      isFavorite: appData.favoriteIds().has(recipe.id),
    });
  },

  onIncServings() {
    const servings = Math.min(12, this.data.servings + 1);
    this.setData({ servings });
    if (this.recipe) this.load(this.recipe, servings);
  },

  onDecServings() {
    const servings = Math.max(1, this.data.servings - 1);
    this.setData({ servings });
    if (this.recipe) this.load(this.recipe, servings);
  },

  onFavorite() {
    if (!this.recipe) return;
    appData.getRepository().toggleFavorite(this.recipe.id);
    this.setData({ isFavorite: appData.favoriteIds().has(this.recipe.id) });
    appData.toast('收藏状态已更新');
  },

  onAddToMenu() {
    if (!this.recipe) return;
    const meals = ['早餐', '午餐', '晚餐'];
    wx.showActionSheet({
      itemList: meals,
      success: (result) => {
        const meal = bundle.MEAL_ORDER[result.tapIndex];
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
        }
        const next = bundle.addDish(menu, { date: today, meal }, this.recipe.id);
        if (next === menu) {
          appData.toast('这道菜已经在今天的这一餐里了');
          return;
        }
        appData.saveMenu(next);
        appData.toast(`已加入今天${meals[result.tapIndex]}`);
      },
    });
  },

  onCopyVideo(event) {
    appData.copyLink(event.currentTarget.dataset.url);
  },

  onCopySearch(event) {
    appData.copyLink(event.currentTarget.dataset.url);
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  goDiscover() {
    wx.switchTab({ url: '/pages/discover/index' });
  },

  onShareAppMessage() {
    const recipe = this.recipe;
    if (!recipe) return { title: '今天吃什么' };
    return {
      title: `${recipe.name} · ${recipe.subtitle}`,
      path: `/pages/detail/index?id=${recipe.id}`,
    };
  },
});
