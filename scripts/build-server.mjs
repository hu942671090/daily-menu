#!/usr/bin/env node
/** 构建数据服务：用 esbuild 打包 TS 与共享包，输出单文件 ESM。 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

await build({
  absWorkingDir: root,
  entryPoints: ['apps/server/src/index.ts'],
  outfile: 'apps/server/dist/index.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  sourcemap: true,
  tsconfig: path.join(root, 'tsconfig.json'),
  external: ['express'],
  logLevel: 'info',
  banner: {
    js: "import { createRequire as __dshCreateRequire } from 'node:module';\nconst require = __dshCreateRequire(import.meta.url);",
  },
});

console.log('✅ 数据服务构建完成：apps/server/dist/index.js');
