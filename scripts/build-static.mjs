#!/usr/bin/env node
/**
 * 生成可直接上传到静态托管（GitHub Pages / Netlify / Cloudflare Pages / Vercel）的版本。
 *
 * 与普通构建的区别：
 * - 不带 Node 数据服务：内容与视频数据打包进 JS，接口请求被关闭；
 * - 图片复制进构建产物（普通构建的图片由服务端 /images 提供）；
 * - 使用 hash 路由（/#/week），刷新子页面不会 404，适合任意静态托管；
 * - 资源使用相对路径（base="./"），可放在域名根目录或任意子路径。
 *
 * 输出：apps/web/dist-static
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const webRoot = path.join(root, 'apps/web');
const publicDir = path.join(webRoot, 'public');
const publicImages = path.join(publicDir, 'images');
const imageSource = path.join(root, 'packages/content/images/recipes');
const outDir = path.join(webRoot, 'dist-static');
const viteBin = path.join(root, 'node_modules/vite/bin/vite.js');

if (!fs.existsSync(imageSource)) {
  console.error(`❌ 找不到图片目录：${imageSource}\n   请先执行 npm run data:images`);
  process.exit(1);
}

function directorySize(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    total += entry.isDirectory() ? directorySize(full) : fs.statSync(full).size;
  }
  return total;
}

console.log('① 复制示意图到 Web public/images …');
fs.rmSync(publicImages, { recursive: true, force: true });
fs.mkdirSync(publicImages, { recursive: true });
fs.cpSync(imageSource, path.join(publicImages, 'recipes'), { recursive: true });
const imageCount = fs.readdirSync(path.join(publicImages, 'recipes')).length;
console.log(`   ${imageCount} 张图片`);

try {
  console.log('② 构建静态站点（hash 路由 / 相对路径 / 内置数据）…');
  const result = spawnSync(
    process.execPath,
    [viteBin, 'build', '--config', path.join(webRoot, 'vite.config.ts')],
    {
      cwd: root,
      stdio: 'inherit',
      env: {
        ...process.env,
        VITE_STATIC: 'true',
        VITE_ROUTER_MODE: 'hash',
        VITE_BASE: './',
        VITE_OUT_DIR: outDir,
        // 静态版不访问任何后端
        VITE_API_BASE_URL: '',
      },
    },
  );
  if (result.status !== 0) {
    console.error('❌ 构建失败');
    process.exit(result.status ?? 1);
  }
} finally {
  // 清理临时图片，避免影响普通构建与仓库体积
  fs.rmSync(publicImages, { recursive: true, force: true });
}

console.log('③ 写入静态托管辅助文件 …');
const indexPath = path.join(outDir, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('❌ 构建产物缺少 index.html');
  process.exit(1);
}
// GitHub Pages / 静态服务器的 SPA 兜底；hash 路由下通常用不到
fs.copyFileSync(indexPath, path.join(outDir, '404.html'));
// Netlify / Cloudflare Pages 的 SPA 回退规则
fs.writeFileSync(path.join(outDir, '_redirects'), '/*    /index.html   200\n', 'utf8');
fs.writeFileSync(
  path.join(outDir, 'DEPLOY.txt'),
  [
    '今天吃什么 · 静态演示版',
    '',
    '上传整个 dist-static 目录到任意静态托管即可：',
    '- Netlify：直接拖拽本目录到 app.netlify.com/drop',
    '- Cloudflare Pages：Create project → Direct Upload → 上传本目录',
    '- GitHub Pages：把本目录内容推到 gh-pages 分支，或作为 Pages 的发布目录',
    '',
    '数据全部内置，无需后端；用户偏好/菜单/收藏保存在各自浏览器 localStorage。',
  ].join('\n'),
  'utf8',
);

const size = directorySize(outDir);
console.log('');
console.log(`✅ 静态版已生成：${path.relative(root, outDir)}`);
console.log(`   体积：${(size / 1024 / 1024).toFixed(1)} MB（含 ${imageCount} 张图片）`);
console.log('   上传方式见 docs/deploy-static.md');
