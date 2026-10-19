#!/usr/bin/env node
/**
 * 生成 README 使用的 H5 视口截图（390×844）。
 * 全页截图保留在 artifacts/，这里只截取用户实际看到的首屏与步骤区。
 *
 * 前置：npm start 或 npm run dev 已启动。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const output = path.join(root, 'docs/screenshots');
const BASE = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:4000';
const EDGE =
  process.env.EDGE_PATH ?? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

fs.mkdirSync(output, { recursive: true });

const browser = await chromium.launch({ executablePath: EDGE, headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: 'zh-CN',
  timezoneId: 'Asia/Shanghai',
});
const page = await context.newPage();

async function shot(name) {
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(output, name), scale: 'css' });
  console.log(`  📸 docs/screenshots/${name}`);
}

await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await page.waitForSelector('.meal-section');
await page.locator('.img-frame.loaded').first().waitFor({ timeout: 10000 }).catch(() => {});
await shot('h5-home-view.png');

await page.goto(`${BASE}/week`, { waitUntil: 'networkidle' });
await page.waitForSelector('.day-tabs');
await shot('h5-week-view.png');

await page.goto(`${BASE}/recipe/tomato-scrambled-egg`, { waitUntil: 'networkidle' });
await page.waitForSelector('.step-card');
await page.locator('.img-frame.loaded').first().waitFor({ timeout: 10000 }).catch(() => {});
await shot('h5-detail-view.png');

await page.locator('.step-card').first().scrollIntoViewIfNeeded();
await shot('h5-steps-view.png');

await browser.close();
console.log('✅ H5 视口截图完成');
