import { RECIPES, VIDEOS } from '@daily-menu/content';
import type { Recipe, RecipeVideo } from '@daily-menu/shared';
import { apiUrl, isStaticBuild } from './assets';

export type DataSource = 'api' | 'local';

export interface ContentBundle {
  recipes: Recipe[];
  videos: RecipeVideo[];
  source: DataSource;
  baseUrl: string;
  error?: string;
}

export interface HealthInfo {
  status: string;
  version: string;
  time: string;
  content: {
    recipes: number;
    videos: number;
    verifiedVideos: number;
    generatedAt: string;
  };
}

const CONTENT_TIMEOUT = 4000;

function localBundle(reason?: string): ContentBundle {
  return {
    recipes: RECIPES,
    videos: VIDEOS,
    source: 'local',
    baseUrl: '',
    error: reason,
  };
}

export async function loadContent(): Promise<ContentBundle> {
  // 纯静态托管（GitHub Pages / Netlify / Cloudflare Pages）没有数据服务，
  // 直接使用随包内置的内容，避免无意义的 /api 请求与报错。
  if (isStaticBuild) return localBundle();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CONTENT_TIMEOUT);
  try {
    const response = await fetch(apiUrl('/api/content'), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = (await response.json()) as {
      recipes?: Recipe[];
      videos?: RecipeVideo[];
      baseUrl?: string;
    };
    if (!Array.isArray(payload.recipes) || payload.recipes.length === 0) {
      throw new Error('接口返回的菜谱为空');
    }
    return {
      recipes: payload.recipes,
      videos: Array.isArray(payload.videos) ? payload.videos : [],
      source: 'api',
      baseUrl: payload.baseUrl ?? '',
    };
  } catch (error) {
    return localBundle(error instanceof Error ? error.message : '接口不可用');
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchHealth(): Promise<HealthInfo | null> {
  if (isStaticBuild) return null;
  try {
    const response = await fetch(apiUrl('/api/health'), {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    return (await response.json()) as HealthInfo;
  } catch {
    return null;
  }
}
