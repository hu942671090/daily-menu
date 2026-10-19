const appData = require('../../utils/app-data');

Page({
  data: {
    ready: false,
    recipes: [],
    count: 0,
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const favoriteIds = appData.favoriteIds();
    const recipes = favoriteIds.size
      ? appData.bundle.RECIPES.filter((recipe) => favoriteIds.has(recipe.id)).map((recipe) =>
          appData.decorateRecipe(recipe, { favoriteIds }),
        )
      : [];
    this.setData({ ready: true, recipes, count: recipes.length });
  },

  onOpen(event) {
    appData.goRecipe(event.currentTarget.dataset.id);
  },

  onFavorite(event) {
    appData.getRepository().toggleFavorite(event.currentTarget.dataset.id);
    this.refresh();
    appData.toast('收藏状态已更新');
  },

  onSwap() {},

  goDiscover() {
    wx.switchTab({ url: '/pages/discover/index' });
  },
});
