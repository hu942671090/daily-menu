#!/usr/bin/env node
/**
 * 内容校验：结构、枚举、图片路径、步骤编号、来源与视频引用。
 * 不生成任何文件，适合接入 CI。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJsonDirectory, readJsonFile, validateDataset, validateRecipe } from './lib/content-schema.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const contentRoot = path.resolve(here, '..');
const recipesDir = path.join(contentRoot, 'data/recipes');
const imagesDir = path.join(contentRoot, 'images/recipes');

const entries = readJsonDirectory(recipesDir);
const recipes = entries.map((entry) => entry.data);
const videos = readJsonFile(path.join(contentRoot, 'data/videos.json'), []);

const errors = [];
const warnings = [];
for (const entry of entries) {
  const result = validateRecipe(entry.data, entry.file);
  errors.push(...result.errors);
  warnings.push(...result.warnings);
}
const datasetResult = validateDataset(recipes, videos);
errors.push(...datasetResult.errors);
warnings.push(...datasetResult.warnings);

// 图片是否存在：生成脚本尚未运行时只做提示
if (fs.existsSync(imagesDir)) {
  for (const recipe of recipes) {
    const expected = [`${recipe.id}.png`, ...recipe.steps.map((step) => `${recipe.id}-step-${step.index}.png`)];
    for (const name of expected) {
      if (!fs.existsSync(path.join(imagesDir, name))) {
        warnings.push(`[images] 缺少图片 ${name}（运行 npm run data:images 生成）`);
      }
    }
  }
} else {
  warnings.push('[images] images/recipes 目录不存在，请运行 npm run data:images');
}

// 视频核验时间不能是未来时间
const now = Date.now();
for (const video of videos) {
  const checkedAt = video.verification?.checkedAt;
  if (checkedAt && Date.parse(checkedAt) > now + 60_000) {
    errors.push(`[video ${video.id}] checkedAt 不能是未来时间：${checkedAt}`);
  }
}

const uniqueVideoRecipes = new Set(videos.map((video) => video.recipeId));
const verifiedVideos = videos.filter((video) => video.verification?.status === 'verified');

console.log('📦 内容数据校验');
console.log(`   菜谱文件：${entries.length}`);
console.log(`   视频记录：${videos.length}（已核验 ${verifiedVideos.length}）`);
console.log(`   有视频的菜谱：${uniqueVideoRecipes.size} / ${recipes.length}`);
console.log(
  `   餐次覆盖：早餐 ${datasetResult.stats.meals.breakfast}｜午餐 ${datasetResult.stats.meals.lunch}｜晚餐 ${datasetResult.stats.meals.dinner}`,
);
console.log(`   菜系：${datasetResult.stats.cuisines.join('、')}`);

if (warnings.length > 0) {
  console.warn(`\n⚠️  提示 ${warnings.length} 条：`);
  for (const warning of warnings) console.warn(`   - ${warning}`);
}

if (errors.length > 0) {
  console.error(`\n❌ 校验失败 ${errors.length} 条：`);
  for (const error of errors) console.error(`   - ${error}`);
  process.exit(1);
}

console.log('\n✅ 校验通过');
