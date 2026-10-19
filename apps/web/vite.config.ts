import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const root = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(root, '../..');
const apiTarget = process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:4000';

export default defineConfig({
  root,
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@daily-menu/shared': path.join(repoRoot, 'packages/shared/src/index.ts'),
      '@daily-menu/content': path.join(repoRoot, 'packages/content/src/index.ts'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    watch: {
      // SMB 网络共享不支持原生 fs.watch（会抛 UNKNOWN），使用轮询保证开发态可用；
      // 本地磁盘开发时可设置 VITE_DISABLE_POLLING=true 关闭轮询。
      usePolling: process.env.VITE_DISABLE_POLLING !== 'true',
      interval: 400,
      ignored: ['**/node_modules/**', '**/dist/**', '**/artifacts/**'],
    },
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true },
      '/images': { target: apiTarget, changeOrigin: true },
    },
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true },
      '/images': { target: apiTarget, changeOrigin: true },
    },
  },
  build: {
    outDir: process.env.VITE_OUT_DIR ?? path.join(root, 'dist'),
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
