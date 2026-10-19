#!/usr/bin/env node
/**
 * 将 JSON 内容数据编译为带类型的 TS 模块，供 Web / 小程序 / API 共同使用。
 * 生成物：packages/content/src/generated/dataset.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJsonDirectory, readJsonFile, validateDataset, validateRecipe } from './lib/content-schema.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const contentRoot = path.resolve(here, '..');
const recipesPath = path.join(contentRoot, 'data/recipes');
const videosPath = path.join(contentRoot, 'data/videos.json');
const outputDir = path.join(contentRoot, 'src/generated');
const outputFile = path.join(outputDir, 'dataset.ts');

const entries = readJsonDirectory(recipesPath);
const recipes = entries.map((entry) => entry.data);
const videos = readJsonFile(videosPath, []);

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

if (warnings.length > 0) {
  console.warn(`\n⚠️  内容提示 ${warnings.length} 条：`);
  for (const warning of warnings) console.warn(`   - ${warning}`);
}

if (errors.length > 0) {
  console.error(`\n❌ 内容校验失败 ${errors.length} 条：`);
  for (const error of errors) console.error(`   - ${error}`);
  process.exit(1);
}

const banner = `/* eslint-disable */
// AUTO-GENERATED FILE. DO NOT EDIT.
// 由 packages/content/scripts/compile-data.mjs 生成，请修改 data/*.json 后重新运行 npm run data:build。
`;

const payload = `${banner}
import type { Recipe, RecipeVideo } from '@daily-menu/shared';

export const DATASET_META = ${JSON.stringify(
  {
    generatedAt: new Date().toISOString(),
    recipeCount: recipes.length,
    videoCount: videos.length,
    verifiedVideoCount: videos.filter((video) => video.verification?.status === 'verified').length,
    cuisineCount: datasetResult.stats.cuisines.length,
    mealCounts: datasetResult.stats.meals,
    schemaVersion: 1,
  },
  null,
  2,
)} as const;

export const RECIPES: Recipe[] = ${JSON.stringify(recipes, null, 2)};

export const VIDEOS: RecipeVideo[] = ${JSON.stringify(videos, null, 2)};
`;

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, payload, 'utf8');

console.log(`✅ 已生成 ${path.relative(process.cwd(), outputFile)}`);
console.log(
  `   菜谱 ${recipes.length} 道｜视频 ${videos.length} 条（已核验 ${
    videos.filter((video) => video.verification?.status === 'verified').length
  } 条）｜菜系 ${datasetResult.stats.cuisines.length} 类`,
);
console.log(
  `   餐次覆盖：早餐 ${datasetResult.stats.meals.breakfast}｜午餐 ${datasetResult.stats.meals.lunch}｜晚餐 ${datasetResult.stats.meals.dinner}`,
);
