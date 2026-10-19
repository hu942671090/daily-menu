const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');
/** 默认 "/"；静态托管构建使用 "./"，以适配 GitHub Pages 等子路径 */
const ASSET_BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');

export const apiBase = API_BASE;
export const isStaticBuild = import.meta.env.VITE_STATIC === 'true';

export function assetUrl(src: string | undefined): string {
  if (!src) return '';
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src;
  const relative = src.startsWith('/') ? src.slice(1) : src;
  if (API_BASE) return `${API_BASE}/${relative}`;
  return `${ASSET_BASE}/${relative}`;
}

export function apiUrl(pathname: string): string {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${API_BASE}${normalized}`;
}
