#!/usr/bin/env node
/**
 * 开发态启动器：同时启动数据服务（tsx 直接运行 TS）与 Vite。
 * 输出统一加前缀，任一子进程退出时关闭另一个。
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const node = process.execPath;
const children = [];
let shuttingDown = false;

function pipeWithPrefix(stream, prefix, target) {
  let buffer = '';
  stream.setEncoding('utf8');
  stream.on('data', (chunk) => {
    buffer += chunk;
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? '';
    for (const line of lines) target.write(`${prefix} ${line}\n`);
  });
  stream.on('end', () => {
    if (buffer) target.write(`${prefix} ${buffer}\n`);
  });
}

function start(name, args, prefix, env = {}) {
  const child = spawn(node, args, {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  children.push(child);
  pipeWithPrefix(child.stdout, prefix, process.stdout);
  pipeWithPrefix(child.stderr, prefix, process.stderr);
  child.on('exit', (code) => {
    if (shuttingDown) return;
    console.log(`\n[dev] ${name} 已退出（code=${code}），正在关闭其他进程…`);
    shutdown(code ?? 1);
  });
  return child;
}

function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  setTimeout(() => process.exit(code), 200);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

start('api', ['--import', 'tsx', 'apps/server/src/index.ts'], '[api]', {
  PORT: process.env.PORT ?? '4000',
});

start(
  'vite',
  ['node_modules/vite/bin/vite.js', '--config', 'apps/web/vite.config.ts'],
  '[web]',
);

console.log('');
console.log('  今天吃什么 · 开发环境');
console.log('  ➜ H5 / PC:  http://127.0.0.1:5173');
console.log('  ➜ API:      http://127.0.0.1:4000/api/health');
console.log('  （手机调试：将 --host 暴露到局域网后，用手机访问同一地址）');
console.log('');
