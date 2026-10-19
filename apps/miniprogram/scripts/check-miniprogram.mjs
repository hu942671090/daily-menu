#!/usr/bin/env node
/**
 * 小程序工程静态检查 + 页面逻辑冒烟测试。
 *
 * 不依赖微信开发者工具：用最小的 wx / Page / getApp 模拟环境加载真实页面 JS，
 * 直接调用 onShow / 事件处理函数，验证推荐、周菜单、替换、锁定、收藏、偏好、
 * 购物清单等核心流程与本地持久化。
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const mpRoot = path.resolve(here, '..');
const requireFromMp = createRequire(path.join(mpRoot, 'app.js'));

const failures = [];
const passes = [];

function check(name, fn) {
  try {
    fn();
    passes.push(name);
    console.log(`  ✔ ${name}`);
  } catch (error) {
    failures.push({ name, error });
    console.error(`  ✖ ${name}\n    ${error.message}`);
  }
}

/* ------------------------------------------------------------------ 静态检查 */

const appJson = JSON.parse(fs.readFileSync(path.join(mpRoot, 'app.json'), 'utf8'));
check('app.json 中的每个页面都有 js/json/wxml/wxss', () => {
  for (const page of appJson.pages) {
    for (const ext of ['js', 'json', 'wxml', 'wxss']) {
      const file = path.join(mpRoot, `${page}.${ext}`);
      assert.ok(fs.existsSync(file), `缺少 ${page}.${ext}`);
    }
  }
});

check('tabBar 图标文件存在', () => {
  for (const item of appJson.tabBar.list) {
    assert.ok(fs.existsSync(path.join(mpRoot, item.iconPath)), `缺少 ${item.iconPath}`);
    assert.ok(fs.existsSync(path.join(mpRoot, item.selectedIconPath)), `缺少 ${item.selectedIconPath}`);
  }
});

check('共享 bundle 已构建且包含完整数据', () => {
  const bundle = requireFromMp('./shared/bundle.js');
  assert.equal(bundle.RECIPES.length, 25);
  assert.ok(typeof bundle.createWeekMenu === 'function');
  assert.ok(typeof bundle.searchRecipes === 'function');
  assert.ok(typeof bundle.buildShoppingList === 'function');
  assert.ok(bundle.VIDEOS.every((video) => video.verification && video.verification.status));
});

check('WXML 标签闭合', () => {
  const selfClosing = new Set(['image', 'input', 'import', 'include', 'icon', 'progress', 'switch', 'slider', 'textarea']);
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === 'shared' || entry.name === 'images') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.wxml')) files.push(full);
    }
  };
  walk(mpRoot);
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
    const stack = [];
    const tagPattern = /<\/?([a-zA-Z][\w-]*)([^>]*?)(\/?)>/g;
    let match;
    while ((match = tagPattern.exec(content)) !== null) {
      const [raw, tag, , selfClose] = match;
      if (raw.startsWith('</')) {
        const open = stack.pop();
        assert.equal(open, tag, `${path.relative(mpRoot, file)} 中 </${tag}> 与 <${open}> 不匹配`);
      } else if (!selfClose && !selfClosing.has(tag)) {
        stack.push(tag);
      }
    }
    assert.equal(stack.length, 0, `${path.relative(mpRoot, file)} 存在未闭合标签：${stack.join(', ')}`);
  }
});

/* ------------------------------------------------------------------ 模拟环境 */

const storage = new Map();
let clipboard = '';
const toastLog = [];
let modalAnswer = { confirm: true };
const navigation = [];

global.wx = {
  getStorageSync(key) {
    return storage.has(key) ? storage.get(key) : '';
  },
  setStorageSync(key, value) {
    storage.set(key, value);
  },
  removeStorageSync(key) {
    storage.delete(key);
  },
  showToast(options) {
    toastLog.push(options.title);
  },
  showModal(options) {
    if (options.success) options.success(modalAnswer);
  },
  showActionSheet(options) {
    if (options.success) options.success({ tapIndex: 2 });
  },
  setClipboardData(options) {
    clipboard = options.data;
    if (options.success) options.success();
  },
  navigateTo(options) {
    navigation.push(options.url);
  },
  switchTab(options) {
    navigation.push(options.url);
  },
  navigateBack() {},
  stopPullDownRefresh() {},
};

const bundle = requireFromMp('./shared/bundle.js');
const appMock = {
  globalData: {
    repository: bundle.createStorageRepository(
      {
        getItem: (key) => (storage.has(key) ? storage.get(key) : null),
        setItem: (key, value) => storage.set(key, value),
        removeItem: (key) => storage.delete(key),
      },
      { defaultTimezone: 'Asia/Shanghai' },
    ),
  },
};
global.getApp = () => appMock;

function loadPage(relativePath) {
  const fullPath = path.join(mpRoot, relativePath);
  let config = null;
  global.Page = (value) => {
    config = value;
  };
  delete requireFromMp.cache[requireFromMp.resolve(fullPath)];
  requireFromMp(fullPath);
  assert.ok(config, `${relativePath} 未调用 Page()`);
  const instance = Object.create(config);
  instance.data = JSON.parse(JSON.stringify(config.data || {}));
  instance.setData = function setData(patch) {
    Object.assign(this.data, patch);
  };
  return instance;
}

function event(dataset) {
  return { currentTarget: { dataset } };
}

/* ------------------------------------------------------------------ 页面流程 */

check('首页：加载今日三餐，且菜单被持久化', () => {
  const home = loadPage('pages/home/index.js');
  home.onShow();
  assert.equal(home.data.ready, true);
  assert.equal(home.data.meals.length, 3);
  assert.ok(home.data.summary.dishCount >= 5);
  assert.ok(home.data.today);
  assert.ok(storage.has('dm.v1.menus'), '菜单未写入本地存储');
  const menu = appMock.globalData.repository.loadMenu(
    bundle.startOfWeekMonday(home.data.today),
  );
  assert.ok(menu, '无法从本地存储恢复菜单');
  assert.equal(menu.days.length, 7);
});

check('首页：换一道只替换目标菜，其他菜保持不变', () => {
  const home = loadPage('pages/home/index.js');
  home.onShow();
  const menu = appMock.globalData.repository.loadMenu(
    bundle.startOfWeekMonday(home.data.today),
  );
  const before = menu.days
    .find((day) => day.date === home.data.today)
    .meals.dinner.map((dish) => dish.recipeId);
  home.onSwap(event({ date: home.data.today, meal: 'dinner', index: 0 }));
  const after = appMock.globalData.repository.loadMenu(
    bundle.startOfWeekMonday(home.data.today),
  );
  const afterIds = after.days
    .find((day) => day.date === home.data.today)
    .meals.dinner.map((dish) => dish.recipeId);
  assert.notEqual(afterIds[0], before[0], '目标菜没有变化');
  assert.equal(afterIds[1], before[1], '同餐其他菜被意外改动');
});

check('周菜单：锁定后换一餐仍保留锁定菜品', () => {
  const week = loadPage('pages/week/index.js');
  week.onShow();
  assert.equal(week.data.hasMenu, true);
  const date = week.data.selectedDate;
  const menu = appMock.globalData.repository.loadMenu(week.data.weekStart);
  const lunch = menu.days.find((day) => day.date === date).meals.lunch;
  week.onToggleLock(event({ date, meal: 'lunch', index: 0 }));
  const lockedMenu = appMock.globalData.repository.loadMenu(week.data.weekStart);
  const lockedId = lockedMenu.days.find((day) => day.date === date).meals.lunch[0].recipeId;
  assert.equal(lockedMenu.days.find((day) => day.date === date).meals.lunch[0].locked, true);

  week.onRegenerateMeal(event({ date, meal: 'lunch' }));
  const regenerated = appMock.globalData.repository.loadMenu(week.data.weekStart);
  const regeneratedLunch = regenerated.days.find((day) => day.date === date).meals.lunch;
  assert.ok(
    regeneratedLunch.some((dish) => dish.recipeId === lockedId && dish.locked),
    '重新生成后锁定菜品丢失',
  );
  assert.ok(lunch.length >= 1);
});

check('周菜单：生成 / 切换到下一周可恢复', () => {
  const week = loadPage('pages/week/index.js');
  week.onShow();
  const firstWeek = week.data.weekStart;
  week.onNextWeek();
  const nextWeek = week.data.weekStart;
  assert.notEqual(nextWeek, firstWeek);
  if (!week.data.hasMenu) {
    week.onGenerate();
    assert.equal(week.data.hasMenu, true);
  }
  const stored = appMock.globalData.repository.loadMenu(nextWeek);
  assert.ok(stored, '下一周菜单未保存');
  week.onPrevWeek();
  assert.equal(week.data.weekStart, firstWeek);
});

check('菜谱详情：人数换算、收藏、加入今日菜单', () => {
  const detail = loadPage('pages/detail/index.js');
  detail.onLoad({ id: 'tomato-scrambled-egg' });
  assert.equal(detail.data.ready, true);
  assert.ok(detail.data.steps.length >= 4);
  const firstGroup = detail.data.groups[0];
  const before = firstGroup.items[0].amountText;
  detail.onIncServings();
  const after = detail.data.groups[0].items[0].amountText;
  assert.notEqual(after, before, '增加人数后用量没有变化');
  assert.match(after, /克|个|毫升/);

  detail.onFavorite();
  assert.equal(detail.data.isFavorite, true);
  assert.ok(
    appMock.globalData.repository.loadFavorites().some((record) => record.recipeId === 'tomato-scrambled-egg'),
  );

  detail.onAddToMenu();
  const prefs = appMock.globalData.repository.loadPreferences();
  const today = bundle.todayInTimeZone(prefs.timezone);
  const menu = appMock.globalData.repository.loadMenu(bundle.startOfWeekMonday(today));
  const dinner = menu.days.find((day) => day.date === today).meals.dinner;
  assert.ok(dinner.some((dish) => dish.recipeId === 'tomato-scrambled-egg'));
});

check('发现页：按菜名搜索与餐次筛选', () => {
  const discover = loadPage('pages/discover/index.js');
  discover.onShow();
  const total = discover.data.total;
  assert.ok(total >= 20);
  discover.onInput({ detail: { value: '番茄' } });
  discover.apply();
  assert.ok(discover.data.results.length > 0);
  assert.ok(discover.data.results.every((item) => item.name.includes('番茄') || item.ingredientsText.includes('番茄')));
  discover.onReset();
  discover.toggleMeal(event({ key: 'breakfast' }));
  assert.ok(discover.data.results.every((item) => item.metaText));
});

check('收藏页：读取收藏并可取消', () => {
  const favorites = loadPage('pages/favorites/index.js');
  favorites.onShow();
  assert.ok(favorites.data.count >= 1);
  const id = favorites.data.recipes[0].id;
  favorites.onFavorite(event({ id }));
  assert.ok(!appMock.globalData.repository.isFavorite(id));
});

check('偏好页：保存偏好后重新读取生效', () => {
  const preferences = loadPage('pages/preferences/index.js');
  preferences.onShow();
  assert.equal(preferences.data.ready, true);
  preferences.toggleCuisine(event({ index: 1 })); // 川湘
  preferences.changeServings(event({ delta: 1 }));
  preferences.onSave();
  const saved = appMock.globalData.repository.loadPreferences();
  assert.ok(saved.cuisines.includes('川湘'));
  assert.equal(preferences.data.dirty, false);

  preferences.onSaveAndRegenerate();
  const today = bundle.todayInTimeZone(saved.timezone);
  const menu = appMock.globalData.repository.loadMenu(bundle.startOfWeekMonday(today));
  assert.equal(menu.preferences.cuisines.includes('川湘'), true);
});

check('购物清单：合并食材、勾选并持久化', () => {
  const shopping = loadPage('pages/shopping/index.js');
  shopping.onLoad({});
  shopping.onShow();
  assert.ok(shopping.data.mainItems.length > 0);
  const first = shopping.data.mainItems[0];
  shopping.onToggle(event({ key: first.key }));
  const checks = appMock.globalData.repository.loadShoppingChecks(shopping.data.weekStart);
  assert.equal(checks[first.key], true);
  shopping.onCopy();
  assert.ok(clipboard.includes('购物清单'));
});

/* ------------------------------------------------------------------ 结果 */

console.log('');
if (failures.length > 0) {
  console.error(`❌ 小程序检查失败 ${failures.length} 项（通过 ${passes.length} 项）`);
  process.exit(1);
}
console.log(`✅ 小程序检查通过：${passes.length} 项（含页面逻辑冒烟测试）`);
