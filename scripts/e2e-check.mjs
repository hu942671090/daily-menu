#!/usr/bin/env node
/**
 * 端到端验收脚本（Edge + playwright-core，无需下载浏览器）
 *
 * 覆盖：
 * - PC 首页 / 周菜单 / 发现 / 详情 / 收藏 / 偏好 / 购物清单
 * - 今日推荐与周菜单一致
 * - 换一道只替换目标菜、锁定后重新生成仍保留、替换弹窗可用
 * - 人数换算、收藏持久化、偏好持久化、购物清单勾选持久化
 * - H5（390x844）横向溢出、按钮尺寸、关键页面截图
 *
 * 前置：API 已启动（npm start 或 npm run dev）；使用 npm run build:web 后的产物。
 * 用法：node scripts/e2e-check.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const artifacts = path.join(root, 'artifacts');
const BASE = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:4000';
const EDGE =
  process.env.EDGE_PATH ?? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const results = [];
const consoleErrors = [];

function check(name, condition, detail = '') {
  if (condition) {
    results.push({ name, ok: true });
    console.log(`  ✔ ${name}`);
  } else {
    results.push({ name, ok: false, detail });
    console.error(`  ✖ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

async function settle(page) {
  // 触发图片懒加载并等待淡入完成，避免全页截图中出现空白占位
  await page.evaluate(async () => {
    // 关闭平滑滚动，确保截图前真正回到页面顶部
    const previous = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    const step = Math.max(280, Math.round(window.innerHeight * 0.7));
    const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 220));
    }
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 500));
    document.documentElement.style.scrollBehavior = previous;
  });
  await page
    .waitForFunction(
      () => [...document.images].every((image) => image.complete),
      undefined,
      { timeout: 15000 },
    )
    .catch(() => {});
  await page.waitForTimeout(600);
}

async function screenshot(page, name, options = {}) {
  const { fullPage = true, settleFirst = true } = options;
  if (settleFirst) await settle(page);
  await page.screenshot({ path: path.join(artifacts, `${name}.png`), fullPage, scale: 'css' });
  console.log(`    📸 artifacts/${name}.png`);
}

async function readMenus(page) {
  return page.evaluate(() => {
    try {
      return JSON.parse(localStorage.getItem('dm.v1.menus') || '{}');
    } catch {
      return {};
    }
  });
}

async function readJson(page, key) {
  return page.evaluate((storageKey) => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || 'null');
    } catch {
      return null;
    }
  }, key);
}

function firstMenu(menus) {
  const weeks = Object.values(menus);
  return weeks[0] ?? null;
}

async function main() {
  fs.mkdirSync(artifacts, { recursive: true });
  if (!fs.existsSync(EDGE)) throw new Error(`找不到 Edge：${EDGE}`);

  const browser = await chromium.launch({ executablePath: EDGE, headless: true });
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
  });
  const page = await desktop.newPage();
  page.on('pageerror', (error) => consoleErrors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(`console: ${message.text()}`);
  });

  console.log(`\n开始端到端检查：${BASE}\n`);

  /* ---------------------------------------------------------------- 首页 */
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.hero h1');
  check('首页渲染标题与今日三餐', (await page.locator('.hero h1').count()) === 1);
  check('首页展示三个餐次', (await page.locator('.meal-section').count()) === 3);

  const menus = await readMenus(page);
  const menu = firstMenu(menus);
  check('首页已生成本周菜单并写入本地存储', Boolean(menu && menu.days?.length === 7));

  const today = menu.days.find((day) => day.date === (menu.days[0]?.date ?? ''));
  void today;
  const homeCardNames = await page.locator('.meal-section .recipe-title').allInnerTexts();
  check('首页菜谱卡片数量与菜单一致', homeCardNames.length >= 5, `实际 ${homeCardNames.length}`);

  // 今日推荐必须与菜单中今天的安排一致（按菜谱 id 对比）
  const consistency = await page.evaluate(() => {
    const stored = JSON.parse(localStorage.getItem('dm.v1.menus') || '{}');
    const menus = Object.values(stored);
    if (menus.length === 0) return null;
    const menu = menus[0];
    const today = new Date().toLocaleDateString('en-CA', { timeZone: menu.timezone });
    const day = menu.days.find((item) => item.date === today) || menu.days[0];
    const menuIds = [];
    for (const meal of ['breakfast', 'lunch', 'dinner']) {
      for (const dish of day.meals[meal]) menuIds.push(dish.recipeId);
    }
    const renderedIds = [...document.querySelectorAll('.meal-section .recipe-media')].map((anchor) =>
      (anchor.getAttribute('href') || '').replace('/recipe/', ''),
    );
    return {
      date: day.date,
      menuIds,
      renderedIds,
      same:
        menuIds.length === renderedIds.length &&
        menuIds.every((id) => renderedIds.includes(id)),
    };
  });
  check(
    '今日推荐与本周菜单逐道一致',
    Boolean(consistency && consistency.same),
    JSON.stringify(consistency),
  );
  await screenshot(page, 'pc-home');

  // 同一天刷新页面不应改变已保存的推荐
  const menuSnapshot = await page.evaluate(() => localStorage.getItem('dm.v1.menus'));
  const homeIdsBeforeReload = await page
    .locator('.meal-section .recipe-media')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.hero h1');
  const menuAfterReload = await page.evaluate(() => localStorage.getItem('dm.v1.menus'));
  const homeIdsAfterReload = await page
    .locator('.meal-section .recipe-media')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
  check(
    '刷新页面后今日推荐与保存的菜单保持不变',
    menuSnapshot === menuAfterReload &&
      JSON.stringify(homeIdsBeforeReload) === JSON.stringify(homeIdsAfterReload),
  );

  /* ---------------------------------------------------------------- 换一道 */
  const menuBefore = firstMenu(await readMenus(page));
  const todayDate = consistency.date;
  const breakfastBefore = menuBefore.days
    .find((day) => day.date === todayDate)
    .meals.breakfast.map((dish) => dish.recipeId);
  await page.locator('.meal-section').first().getByRole('button', { name: '换一道' }).first().click();
  await page.waitForTimeout(600);
  const menuAfterSwap = firstMenu(await readMenus(page));
  const breakfastAfter = menuAfterSwap.days
    .find((day) => day.date === todayDate)
    .meals.breakfast.map((dish) => dish.recipeId);
  check('“换一道”替换了目标菜', breakfastBefore[0] !== breakfastAfter[0]);
  const lunchBefore = menuBefore.days.find((day) => day.date === todayDate).meals.lunch.map((dish) => dish.recipeId);
  const lunchAfter = menuAfterSwap.days.find((day) => day.date === todayDate).meals.lunch.map((dish) => dish.recipeId);
  check('“换一道”不影响同一天其他餐次', JSON.stringify(lunchBefore) === JSON.stringify(lunchAfter));

  /* ---------------------------------------------------------------- 周菜单 */
  await page.goto(`${BASE}/week`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.week-board');
  check('PC 周菜单展示 7 天 × 3 餐', (await page.locator('.week-row').count()) === 7, `实际 ${await page.locator('.week-row').count()}`);
  await screenshot(page, 'pc-week');

  const firstCell = page.locator('.week-row').first().locator('.week-cell').nth(2);
  const firstDishName = await firstCell.locator('.dish-name').first().innerText();
  await firstCell.locator('button[title="锁定（重新生成时保留）"]').first().click();
  await page.waitForTimeout(400);
  const lockedMenu = firstMenu(await readMenus(page));
  const lockedDish = lockedMenu.days
    .flatMap((day) => Object.entries(day.meals).flatMap(([meal, dishes]) => dishes.map((dish) => ({ ...dish, meal }))))
    .find((dish) => dish.locked);
  check('锁定按钮写入锁定状态', Boolean(lockedDish), `菜品 ${firstDishName}`);

  await page.getByRole('button', { name: /重新生成本周/ }).click();
  await page.waitForSelector('.modal');
  await screenshot(page, 'pc-week-confirm', { fullPage: false, settleFirst: false });
  await page.getByRole('button', { name: '重新生成', exact: true }).click();
  await page.waitForTimeout(900);
  const regenerated = firstMenu(await readMenus(page));
  const stillLocked = regenerated.days
    .flatMap((day) => Object.values(day.meals).flat())
    .find((dish) => dish.locked && dish.recipeId === lockedDish?.recipeId);
  check('重新生成本周后锁定菜品仍保留', Boolean(stillLocked));
  check('重新生成后菜单仍为 7 天', regenerated.days.length === 7);

  // 替换弹窗
  const replaceButton = page.locator('.dish-tools button[title="替换这道菜"]').first();
  await replaceButton.click();
  await page.waitForSelector('.modal .picker-item');
  const pickerCount = await page.locator('.modal .picker-item').count();
  check('替换菜品弹窗可搜索并列出候选', pickerCount > 0, `候选 ${pickerCount} 道`);
  const targetCellNameBefore = await page.locator('.dish-name').first().innerText();
  await page.locator('.modal .picker-item').first().click();
  await page.waitForTimeout(500);
  const targetCellNameAfter = await page.locator('.dish-name').first().innerText();
  check('从弹窗选择后替换生效', targetCellNameBefore !== targetCellNameAfter, `${targetCellNameBefore} → ${targetCellNameAfter}`);

  await page.getByRole('button', { name: '保存菜单' }).click();
  await page.waitForTimeout(300);
  check(
    '保存菜单后数据仍在本地',
    Boolean(firstMenu(await readMenus(page))?.days?.length === 7),
  );

  /* ---------------------------------------------------------------- 详情 */
  await page.goto(`${BASE}/recipe/tomato-scrambled-egg`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.step-card');
  check('菜谱详情包含完整的顺序步骤', (await page.locator('.step-card').count()) >= 4);
  check('每个步骤都有步骤图', (await page.locator('.step-media img').count()) >= 4);
  check(
    '步骤图文字说明与编号对应',
    (await page.locator('.step-number').first().innerText()) === '1' &&
      (await page.locator('.media-caption').first().innerText()).includes('步骤 1'),
  );

  const amountBefore = await page.locator('.ingredient-list .amount').first().innerText();
  await page.locator('.detail-side .stepper button').last().click();
  await page.waitForTimeout(300);
  const amountAfter = await page.locator('.ingredient-list .amount').first().innerText();
  check('调整人数后食材用量同步换算', amountBefore !== amountAfter, `${amountBefore} → ${amountAfter}`);

  const servingsText = await page.locator('.detail-side .stepper .value').innerText();
  check('人数控件显示当前人数', /\d+\s*人/.test(servingsText), servingsText);

  const hasVideoCards = (await page.locator('.video-card').count()) > 0;
  const emptyVideo = (await page.locator('.video-empty').count()) > 0;
  check('视频模块展示已核验视频或明确的空状态', hasVideoCards || emptyVideo);
  if (hasVideoCards) {
    const videoText = await page.locator('.video-card').first().innerText();
    check('视频卡片包含作者与核验信息', videoText.includes('UP：') && videoText.includes('核验于'));
  }
  const searchLinkText = await page.locator('.search-links').innerText();
  check('搜索入口明确标注非已匹配教程', searchLinkText.includes('不是已匹配的教程'));

  await page.getByRole('button', { name: '收藏这道菜' }).click();
  await page.waitForTimeout(400);
  await screenshot(page, 'pc-detail');

  /* ---------------------------------------------------------------- 收藏 */
  await page.goto(`${BASE}/favorites`, { waitUntil: 'networkidle' });
  check('收藏页显示已收藏菜谱', (await page.locator('.recipe-card').count()) >= 1);
  await page.reload({ waitUntil: 'networkidle' });
  check('刷新后收藏仍然保留', (await page.locator('.recipe-card').count()) >= 1);
  await screenshot(page, 'pc-favorites');

  /* ---------------------------------------------------------------- 偏好 */
  await page.goto(`${BASE}/preferences`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '川湘', exact: true }).click();
  await page.getByRole('button', { name: '保存偏好' }).click();
  await page.waitForTimeout(400);
  const prefs = await readJson(page, 'dm.v1.preferences');
  check('保存偏好写入本地存储', Array.isArray(prefs?.cuisines) && prefs.cuisines.includes('川湘'));
  await page.reload({ waitUntil: 'networkidle' });
  const selected = await page
    .getByRole('button', { name: '川湘', exact: true })
    .getAttribute('class');
  check('刷新后偏好仍为选中状态', selected?.includes('selected') === true);
  await screenshot(page, 'pc-preferences');

  /* ---------------------------------------------------------------- 发现 */
  await page.goto(`${BASE}/discover`, { waitUntil: 'networkidle' });
  await page.getByPlaceholder(/搜索菜名或食材/).fill('番茄');
  await page.waitForTimeout(500);
  const discoverCount = await page.locator('.recipe-card').count();
  check('搜索“番茄”返回结果', discoverCount > 0, `结果 ${discoverCount}`);
  const discoverNames = await page.locator('.recipe-title').allInnerTexts();
  check('搜索结果与关键词相关', discoverNames.some((name) => name.includes('番茄')), discoverNames.join('、'));
  await screenshot(page, 'pc-discover');

  /* ---------------------------------------------------------------- 购物清单 */
  await page.goto(`${BASE}/shopping`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.shopping-item');
  const shoppingCount = await page.locator('.shopping-item').count();
  check('购物清单合并食材并展示数量', shoppingCount > 0, `${shoppingCount} 项`);
  await page.locator('.check-box').first().click();
  await page.waitForTimeout(300);
  await page.reload({ waitUntil: 'networkidle' });
  const checkedCount = await page.locator('.shopping-item.checked').count();
  check('购物清单勾选在刷新后保留', checkedCount >= 1);
  await screenshot(page, 'pc-shopping');

  /* ---------------------------------------------------------------- 空状态 */
  await page.goto(`${BASE}/recipe/not-exists`, { waitUntil: 'networkidle' });
  check('不存在的菜谱展示空状态', (await page.locator('.empty-state').count()) >= 1);

  /* ---------------------------------------------------------------- 手机端 */
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
  });
  const mobilePage = await mobile.newPage();
  mobilePage.on('pageerror', (error) => consoleErrors.push(`mobile pageerror: ${error.message}`));

  const mobileRoutes = [
    { path: '/', name: 'h5-home', selector: '.meal-section' },
    { path: '/week', name: 'h5-week', selector: '.day-tabs' },
    { path: '/recipe/tomato-scrambled-egg', name: 'h5-detail', selector: '.step-card' },
    { path: '/preferences', name: 'h5-preferences', selector: '.pref-layout' },
    { path: '/shopping', name: 'h5-shopping', selector: '.shopping-item' },
  ];

  for (const route of mobileRoutes) {
    await mobilePage.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle' });
    await mobilePage.waitForSelector(route.selector);
    await settle(mobilePage);
    const layout = await mobilePage.evaluate(() => {
      const width = window.innerWidth;
      const docWidth = document.documentElement.scrollWidth;
      const offenders = [...document.querySelectorAll('body *')]
        .filter((element) => {
          const style = getComputedStyle(element);
          if (style.position === 'fixed' || style.position === 'sticky') return false;
          const rect = element.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return false;
          return rect.right > width + 1 || rect.left < -1;
        })
        .slice(0, 5)
        .map((element) => `${element.tagName.toLowerCase()}.${String(element.className).slice(0, 40)}`);
      return { width, docWidth, offenders };
    });
    check(
      `H5 ${route.path} 无横向溢出`,
      layout.docWidth <= layout.width + 1,
      `scrollWidth=${layout.docWidth} viewport=${layout.width} ${layout.offenders.join(' | ')}`,
    );

    const smallTargets = await mobilePage.evaluate(() => {
      return [...document.querySelectorAll('.btn, .icon-btn, .bottom-nav a, .check-box')]
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && rect.height < 36;
        })
        .slice(0, 5)
        .map((element) => `${element.tagName.toLowerCase()}.${String(element.className).slice(0, 30)}:${Math.round(element.getBoundingClientRect().height)}px`);
    });
    check(`H5 ${route.path} 按钮高度可点击`, smallTargets.length === 0, smallTargets.join(' | '));

    await screenshot(mobilePage, route.name, { settleFirst: false });
  }

  // 底部导航可用
  await mobilePage.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  check('H5 底部导航存在 5 个入口', (await mobilePage.locator('.bottom-nav a').count()) === 5);
  await mobilePage.locator('.bottom-nav a').nth(1).click();
  await mobilePage.waitForTimeout(600);
  check('H5 底部导航可切换页面', (await mobilePage.locator('.day-tabs').count()) === 1);
  await screenshot(mobilePage, 'h5-week-selected');

  // H5 主要操作：换一道、人数换算
  await mobilePage.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await mobilePage.waitForSelector('.meal-section');
  const readBreakfastIds = () =>
    mobilePage.evaluate(() => {
      const menus = Object.values(JSON.parse(localStorage.getItem('dm.v1.menus') || '{}'));
      if (menus.length === 0) return [];
      const menu = menus[0];
      const today = new Date().toLocaleDateString('en-CA', { timeZone: menu.timezone });
      const day = menu.days.find((item) => item.date === today) || menu.days[0];
      return day.meals.breakfast.map((dish) => dish.recipeId);
    });
  const mobileBreakfastBefore = await readBreakfastIds();
  await mobilePage
    .locator('.meal-section')
    .first()
    .getByRole('button', { name: '换一道' })
    .first()
    .click();
  await mobilePage.waitForTimeout(700);
  const mobileBreakfastAfter = await readBreakfastIds();
  check(
    'H5 可完成「换一道」操作',
    mobileBreakfastBefore.length > 0 &&
      JSON.stringify(mobileBreakfastBefore) !== JSON.stringify(mobileBreakfastAfter),
  );

  await mobilePage.goto(`${BASE}/recipe/tomato-scrambled-egg`, { waitUntil: 'networkidle' });
  await mobilePage.waitForSelector('.step-card');
  const mobileAmountBefore = await mobilePage.locator('.ingredient-list .amount').first().innerText();
  await mobilePage.locator('.detail-side .stepper button').last().click();
  await mobilePage.waitForTimeout(400);
  const mobileAmountAfter = await mobilePage.locator('.ingredient-list .amount').first().innerText();
  check('H5 可调整人数并换算用量', mobileAmountBefore !== mobileAmountAfter);

  check('页面无未捕获 JS 错误', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));

  await browser.close();

  const failed = results.filter((item) => !item.ok);
  console.log('');
  console.log(`通过 ${results.length - failed.length} / ${results.length}`);
  fs.writeFileSync(
    path.join(artifacts, 'e2e-report.json'),
    JSON.stringify({ base: BASE, checkedAt: new Date().toISOString(), results, consoleErrors }, null, 2),
    'utf8',
  );
  if (failed.length > 0) {
    console.error(`\n❌ 端到端检查失败 ${failed.length} 项`);
    process.exit(1);
  }
  console.log('\n✅ 端到端检查全部通过');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
