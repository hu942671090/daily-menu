const appData = require('../../utils/app-data');

const { bundle } = appData;

const CUISINES = ['家常菜', '川湘', '粤式', '江浙', '北方', '西式', '日韩', '轻食'];
const TASTES = ['清淡', '咸鲜', '香辣', '酸甜', '酱香', '鲜香', '奶香', '微甜', '蒜香'];
const TIME_OPTIONS = [15, 20, 30, 45, 60, 90];
const TIMEZONES = [
  { value: 'Asia/Shanghai', label: '北京时间 Asia/Shanghai' },
  { value: 'Asia/Hong_Kong', label: '香港 Asia/Hong_Kong' },
  { value: 'Asia/Tokyo', label: '东京 Asia/Tokyo' },
  { value: 'Asia/Singapore', label: '新加坡 Asia/Singapore' },
  { value: 'Europe/London', label: '伦敦 Europe/London' },
  { value: 'America/New_York', label: '纽约 America/New_York' },
  { value: 'UTC', label: '协调世界时 UTC' },
];
const QUICK_TAGS = {
  avoid: ['猪肉', '牛肉', '羊肉', '动物内脏'],
  allergen: ['花生', '坚果', '虾', '蟹', '贝类', '牛奶', '鸡蛋', '大豆', '麸质', '鱼'],
  dislike: ['香菜', '葱', '蒜', '姜', '辣椒', '花椒'],
};

Page({
  data: {
    ready: false,
    servings: 2,
    cuisines: [],
    tastes: [],
    difficulties: [],
    timeOptions: [],
    maxCookMinutes: 45,
    timezoneIndex: 0,
    timezones: TIMEZONES,
    avoidIngredients: [],
    allergens: [],
    dislikedIngredients: [],
    avoidInput: '',
    allergensInput: '',
    dislikedInput: '',
    quickTags: QUICK_TAGS,
    stats: { recipeCount: 0, verifiedVideoCount: 0 },
    version: '',
    dirty: false,
    stale: false,
  },

  onShow() {
    this.load();
  },

  load() {
    const prefs = appData.getPreferences();
    const today = appData.getToday(prefs);
    const weekStart = bundle.startOfWeekMonday(today);
    const menu = appData.getRepository().loadMenu(weekStart);
    const timezoneIndex = Math.max(
      0,
      TIMEZONES.findIndex((zone) => zone.value === prefs.timezone),
    );
    const stats = bundle.getContentStats();
    this.setData({
      ready: true,
      servings: prefs.servings,
      cuisines: CUISINES.map((label) => ({ label, selected: prefs.cuisines.includes(label) })),
      tastes: TASTES.map((label) => ({ label, selected: prefs.tastes.includes(label) })),
      difficulties: [1, 2, 3].map((value) => ({
        value,
        label: bundle.DIFFICULTY_LABELS[value],
        selected: prefs.difficulties.includes(value),
      })),
      timeOptions: TIME_OPTIONS.map((value) => ({
        value,
        selected: prefs.maxCookMinutes === value,
      })),
      maxCookMinutes: prefs.maxCookMinutes,
      timezoneIndex,
      avoidIngredients: prefs.avoidIngredients,
      allergens: prefs.allergens,
      dislikedIngredients: prefs.dislikedIngredients,
      stats: {
        recipeCount: stats.recipeCount,
        verifiedVideoCount: stats.verifiedVideoCount,
      },
      version: bundle.DATASET_META.generatedAt.slice(0, 10),
      stale: menu ? menu.preferences.updatedAt !== prefs.updatedAt : false,
      dirty: false,
    });
  },

  markDirty(partial) {
    this.setData({ ...partial, dirty: true });
  },

  changeServings(event) {
    const delta = Number(event.currentTarget.dataset.delta);
    const servings = Math.min(12, Math.max(1, this.data.servings + delta));
    this.markDirty({ servings });
  },

  toggleCuisine(event) {
    const index = Number(event.currentTarget.dataset.index);
    const cuisines = this.data.cuisines.map((item, itemIndex) =>
      itemIndex === index ? { ...item, selected: !item.selected } : item,
    );
    this.markDirty({ cuisines });
  },

  toggleTaste(event) {
    const index = Number(event.currentTarget.dataset.index);
    const tastes = this.data.tastes.map((item, itemIndex) =>
      itemIndex === index ? { ...item, selected: !item.selected } : item,
    );
    this.markDirty({ tastes });
  },

  toggleDifficulty(event) {
    const index = Number(event.currentTarget.dataset.index);
    const difficulties = this.data.difficulties.map((item, itemIndex) =>
      itemIndex === index ? { ...item, selected: !item.selected } : item,
    );
    this.markDirty({ difficulties });
  },

  selectTime(event) {
    const value = Number(event.currentTarget.dataset.value);
    this.setData({
      maxCookMinutes: value,
      timeOptions: this.data.timeOptions.map((item) => ({ ...item, selected: item.value === value })),
      dirty: true,
    });
  },

  changeTimezone(event) {
    this.setData({ timezoneIndex: Number(event.detail.value), dirty: true });
  },

  onInput(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({ [field]: event.detail.value });
  },

  addTag(event) {
    const type = event.currentTarget.dataset.type;
    const field = type === 'avoid' ? 'avoidInput' : type === 'allergen' ? 'allergensInput' : 'dislikedInput';
    const listField =
      type === 'avoid' ? 'avoidIngredients' : type === 'allergen' ? 'allergens' : 'dislikedIngredients';
    const raw = (this.data[field] || '').trim();
    if (!raw) return;
    const existing = this.data[listField];
    const additions = raw
      .split(/[,，、;；\s]+/)
      .map((item) => item.trim())
      .filter((item) => item && !existing.includes(item));
    if (additions.length === 0) {
      this.setData({ [field]: '' });
      return;
    }
    this.markDirty({ [listField]: [...existing, ...additions].slice(0, 40), [field]: '' });
  },

  quickAdd(event) {
    const type = event.currentTarget.dataset.type;
    const value = event.currentTarget.dataset.value;
    const listField =
      type === 'avoid' ? 'avoidIngredients' : type === 'allergen' ? 'allergens' : 'dislikedIngredients';
    const existing = this.data[listField];
    if (existing.includes(value)) return;
    this.markDirty({ [listField]: [...existing, value] });
  },

  removeTag(event) {
    const { type, value } = event.currentTarget.dataset;
    const listField =
      type === 'avoid' ? 'avoidIngredients' : type === 'allergen' ? 'allergens' : 'dislikedIngredients';
    this.markDirty({ [listField]: this.data[listField].filter((item) => item !== value) });
  },

  buildPreferences() {
    return {
      servings: this.data.servings,
      cuisines: this.data.cuisines.filter((item) => item.selected).map((item) => item.label),
      tastes: this.data.tastes.filter((item) => item.selected).map((item) => item.label),
      difficulties: this.data.difficulties.filter((item) => item.selected).map((item) => item.value),
      maxCookMinutes: this.data.maxCookMinutes,
      timezone: TIMEZONES[this.data.timezoneIndex].value,
      avoidIngredients: this.data.avoidIngredients,
      allergens: this.data.allergens,
      dislikedIngredients: this.data.dislikedIngredients,
    };
  },

  onSave() {
    const saved = appData.getRepository().savePreferences(this.buildPreferences());
    this.setData({ dirty: false, stale: true });
    appData.toast('偏好已保存');
    return saved;
  },

  onSaveAndRegenerate() {
    const prefs = appData.getRepository().savePreferences(this.buildPreferences());
    const today = appData.getToday(prefs);
    const weekStart = bundle.startOfWeekMonday(today);
    const existing = appData.getRepository().loadMenu(weekStart);
    const menu = appData.regenerateWeek(existing, prefs, weekStart);
    appData.saveMenu(menu);
    this.setData({ dirty: false, stale: false });
    appData.toast('已按新偏好重新生成本周');
  },

  onReset() {
    wx.showModal({
      title: '重置本地数据？',
      content: '会清空偏好、收藏、购物清单勾选与已保存的周菜单，并按默认偏好重新生成。该操作不可撤销。',
      confirmText: '重置',
      confirmColor: '#C14B3C',
      success: (result) => {
        if (!result.confirm) return;
        appData.getRepository().reset();
        const prefs = appData.getPreferences();
        const today = appData.getToday(prefs);
        const weekStart = bundle.startOfWeekMonday(today);
        const menu = bundle.createWeekMenu({
          weekStart,
          preferences: prefs,
          recipes: bundle.RECIPES,
          timezone: prefs.timezone,
        });
        appData.saveMenu(menu);
        this.load();
        appData.toast('已重置并重新生成');
      },
    });
  },
});
