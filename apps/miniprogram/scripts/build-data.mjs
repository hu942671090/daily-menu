#!/usr/bin/env node
/**
 * 把 packages/shared 与 packages/content 打包成小程序可用的 CommonJS 模块。
 * 小程序不支持 TS / node_modules 解析，因此构建出单一 bundle.js。
 *
 * 输出：apps/miniprogram/shared/bundle.js（构建产物，已在 .gitignore 中忽略）
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { build } from 'esbuild';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const outfile = path.join(root, 'apps/miniprogram/shared/bundle.js');

await build({
  absWorkingDir: root,
  entryPoints: ['apps/miniprogram/shared/entry.ts'],
  outfile,
  bundle: true,
  platform: 'neutral',
  format: 'cjs',
  target: ['es2017'],
  tsconfig: path.join(root, 'tsconfig.json'),
  minify: true,
  legalComments: 'none',
  logLevel: 'info',
});

const size = fs.statSync(outfile).size;
console.log(`✅ 小程序共享逻辑已打包：${path.relative(root, outfile)}（${(size / 1024).toFixed(1)} KB）`);
if (size > 1.2 * 1024 * 1024) {
  console.warn('⚠️ 共享包超过 1.2MB，注意小程序主包 2MB 限制');
}
