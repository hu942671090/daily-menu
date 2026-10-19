/**
 * 今天吃什么 · 数据服务
 *
 * 职责：
 * - 提供菜谱、视频、分类元数据等只读内容接口；
 * - 复用 packages/shared 的推荐与购物清单逻辑，提供无状态计算接口；
 * - 生产环境同源托管 Web 构建产物与示意图资源。
 *
 * 游客模式的数据保存在各自端的本地存储；本服务不保存用户数据。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import {
  CUISINES,
  DIFFICULTY_LABELS,
  MEAL_LABELS,
  MEAL_ORDER,
  SLOT_TARGETS,
  TASTE_TAGS,
  buildShoppingList,
  createWeekMenu,
  formatWeekRange,
  isValidTimeZone,
  listStrategies,
  regenerateSlot,
  sanitizeMenu,
  sanitizePreferences,
  todayInTimeZone,
  startOfWeekMonday,
  totalMinutes,
  weekDates,
} from '@daily-menu/shared';
import type {
  Difficulty,
  MealType,
  Preferences,
  Recipe,
  WeekMenu,
} from '@daily-menu/shared';
import {
  DATASET_META,
  RECIPES,
  VIDEOS,
  getContentStats,
  getRecipeById,
  getRelatedRecipes,
  getVideoSearchLinks,
  getVideosForRecipe,
  searchRecipes,
} from '@daily-menu/content';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../..');

loadEnvFile(path.join(repoRoot, '.env'));

const PORT = Number(process.env.PORT ?? 4000);
const HOST = process.env.HOST ?? '127.0.0.1';
const TIMEZONE = process.env.APP_TIMEZONE ?? 'Asia/Shanghai';
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? '*';
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL ?? '';
const imagesDir = process.env.IMAGES_DIR ?? path.join(repoRoot, 'packages/content/images');
const webDist = process.env.WEB_DIST_DIR ?? path.join(repoRoot, 'apps/web/dist');
const startedAt = new Date();

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  const origin = req.headers.origin;
  if (CORS_ORIGIN === '*') {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (origin && CORS_ORIGIN.split(',').map((item) => item.trim()).includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

const started = Date.now();
app.use((req, res, next) => {
  res.on('finish', () => {
    const duration = Date.now() - started;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

function parseList(value: unknown): string[] {
  if (typeof value !== 'string' || value.trim() === '') return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseMeals(value: unknown): MealType[] {
  return parseList(value).filter((meal): meal is MealType =>
    (MEAL_ORDER as string[]).includes(meal),
  );
}

function parseDifficulties(value: unknown): Difficulty[] {
  return parseList(value)
    .map((item) => Number(item))
    .filter((item): item is Difficulty => item === 1 || item === 2 || item === 3);
}

function parseNumber(value: unknown): number | undefined {
  if (typeof value !== 'string' || value.trim() === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function publicBase(req: Request): string {
  if (PUBLIC_BASE_URL) return PUBLIC_BASE_URL.replace(/\/$/, '');
  return `${req.protocol}://${req.get('host') ?? `127.0.0.1:${PORT}`}`;
}

function recipeSummary(recipe: Recipe) {
  return {
    id: recipe.id,
    name: recipe.name,
    subtitle: recipe.subtitle,
    cuisine: recipe.cuisine,
    tastes: recipe.tastes,
    mealTypes: recipe.mealTypes,
    totalMinutes: totalMinutes(recipe),
    difficulty: recipe.difficulty,
    baseServings: recipe.baseServings,
    image: recipe.image,
    mainIngredients: recipe.mainIngredients,
    completeness: recipe.completeness,
  };
}

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: '0.1.0',
    time: new Date().toISOString(),
    uptimeSec: Math.round((Date.now() - startedAt.getTime()) / 1000),
    timezone: TIMEZONE,
    content: {
      recipes: RECIPES.length,
      videos: VIDEOS.length,
      verifiedVideos: VIDEOS.filter((video) => video.verification.status === 'verified').length,
      generatedAt: DATASET_META.generatedAt,
    },
  });
});

app.get('/api/meta', (_req, res) => {
  res.json({
    app: { name: '今天吃什么', version: '0.1.0' },
    timezone: TIMEZONE,
    today: todayInTimeZone(TIMEZONE),
    taxonomy: {
      cuisines: CUISINES,
      tastes: TASTE_TAGS,
      meals: MEAL_ORDER.map((meal) => ({ id: meal, label: MEAL_LABELS[meal] })),
      difficulties: ([1, 2, 3] as Difficulty[]).map((level) => ({
        id: level,
        label: DIFFICULTY_LABELS[level],
      })),
    },
    slotTargets: SLOT_TARGETS,
    strategies: listStrategies().map((strategy) => ({
      id: strategy.id,
      label: strategy.label,
      description: strategy.description,
    })),
    content: getContentStats(),
    dataset: DATASET_META,
  });
});

app.get('/api/content', (req, res) => {
  const base = publicBase(req);
  res.json({
    meta: DATASET_META,
    baseUrl: base,
    today: todayInTimeZone(TIMEZONE),
    timezone: TIMEZONE,
    recipes: RECIPES,
    videos: VIDEOS,
  });
});

app.get('/api/recipes', (req, res) => {
  const query = req.query;
  const meals = parseMeals(query.meals ?? query.meal);
  const difficulties = parseDifficulties(query.difficulties ?? query.difficulty);
  const maxMinutes = parseNumber(query.maxMinutes);
  const limit = Math.min(100, Math.max(1, parseNumber(query.limit) ?? 100));
  const results = searchRecipes(
    {
      q: typeof query.q === 'string' ? query.q.slice(0, 60) : undefined,
      meals: meals.length > 0 ? meals : undefined,
      cuisines: parseList(query.cuisines ?? query.cuisine) as Recipe['cuisine'][],
      tastes: parseList(query.tastes ?? query.taste),
      maxMinutes,
      difficulties: difficulties.length > 0 ? difficulties : undefined,
      hasVideo: query.hasVideo === 'true' || query.hasVerifiedVideo === 'true',
      limit,
    },
    RECIPES,
    VIDEOS,
  );
  res.json({
    total: results.length,
    items: results.map(recipeSummary),
  });
});

app.get('/api/recipes/:id', (req, res) => {
  const recipe = getRecipeById(req.params.id, RECIPES);
  if (!recipe) {
    res.status(404).json({ error: { code: 'RECIPE_NOT_FOUND', message: '未找到该菜谱' } });
    return;
  }
  res.json({
    recipe,
    videos: getVideosForRecipe(recipe.id, VIDEOS),
    videoSearchLinks: getVideoSearchLinks(recipe),
    related: getRelatedRecipes(recipe, 3, RECIPES).map(recipeSummary),
    assetBaseUrl: publicBase(req),
  });
});

app.get('/api/recipes/:id/videos', (req, res) => {
  const recipe = getRecipeById(req.params.id, RECIPES);
  if (!recipe) {
    res.status(404).json({ error: { code: 'RECIPE_NOT_FOUND', message: '未找到该菜谱' } });
    return;
  }
  const videos = getVideosForRecipe(recipe.id, VIDEOS);
  res.json({
    recipeId: recipe.id,
    verified: videos.filter((video) => video.verification.status === 'verified'),
    unverified: videos.filter((video) => video.verification.status !== 'verified'),
    emptyMessage: videos.length === 0 ? '暂无已核验视频' : undefined,
    searchLinks: getVideoSearchLinks(recipe),
  });
});

app.get('/api/videos', (req, res) => {
  const platform = req.query.platform;
  const status = req.query.status;
  const recipeId = req.query.recipeId;
  const items = VIDEOS.filter((video) => {
    if (typeof platform === 'string' && video.platform !== platform) return false;
    if (typeof status === 'string' && video.verification.status !== status) return false;
    if (typeof recipeId === 'string' && video.recipeId !== recipeId) return false;
    return true;
  });
  res.json({ total: items.length, items });
});

app.post('/api/menu/recommend', (req, res) => {
  const body = req.body as {
    weekStart?: string;
    preferences?: Partial<Preferences>;
    seed?: string;
    lockedRecipeIds?: Record<string, string[]>;
  };
  if (!body || typeof body !== 'object') {
    res.status(400).json({ error: { code: 'INVALID_BODY', message: '请求体必须是 JSON 对象' } });
    return;
  }
  const preferences = sanitizePreferences(body.preferences, undefined, TIMEZONE);
  const weekStart = startOfWeekMonday(
    typeof body.weekStart === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.weekStart)
      ? body.weekStart
      : todayInTimeZone(preferences.timezone),
  );
  const menu = createWeekMenu({
    weekStart,
    preferences,
    recipes: RECIPES,
    timezone: preferences.timezone,
    seed: typeof body.seed === 'string' ? body.seed.slice(0, 120) : undefined,
    lockedRecipeIds: body.lockedRecipeIds,
  });
  res.json({
    menu,
    weekLabel: formatWeekRange(menu.weekStart),
    days: weekDates(menu.weekStart),
  });
});

app.post('/api/menu/regenerate-slot', (req, res) => {
  const body = req.body as {
    menu?: unknown;
    date?: string;
    meal?: string;
    preferences?: Partial<Preferences>;
    seed?: string;
  };
  const menu = sanitizeMenu(body?.menu);
  if (!menu) {
    res.status(400).json({ error: { code: 'INVALID_MENU', message: '菜单数据不合法' } });
    return;
  }
  const meal = body.meal;
  if (meal !== 'breakfast' && meal !== 'lunch' && meal !== 'dinner') {
    res.status(400).json({ error: { code: 'INVALID_MEAL', message: '餐次必须是 breakfast/lunch/dinner' } });
    return;
  }
  if (typeof body.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
    res.status(400).json({ error: { code: 'INVALID_DATE', message: '日期格式应为 YYYY-MM-DD' } });
    return;
  }
  const preferences = sanitizePreferences(body.preferences ?? menu.preferences, undefined, TIMEZONE);
  const next = regenerateSlot(
    menu,
    { date: body.date, meal },
    {
      recipes: RECIPES,
      preferences,
      seed: typeof body.seed === 'string' ? body.seed.slice(0, 120) : undefined,
    },
  );
  res.json({ menu: next });
});

app.post('/api/shopping-list', (req, res) => {
  const body = req.body as { menu?: unknown; dates?: string[]; servings?: number };
  const menu = sanitizeMenu(body?.menu);
  if (!menu) {
    res.status(400).json({ error: { code: 'INVALID_MENU', message: '菜单数据不合法' } });
    return;
  }
  const dates = Array.isArray(body.dates)
    ? body.dates.filter((date): date is string => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date))
    : [];
  const items = buildShoppingList(menu, {
    recipes: RECIPES,
    dates: dates.length > 0 ? dates : undefined,
    servings: typeof body.servings === 'number' ? body.servings : undefined,
  });
  res.json({ items, count: items.length });
});

app.get('/api/week', (req, res) => {
  const timezone = typeof req.query.timezone === 'string' && isValidTimeZone(req.query.timezone)
    ? req.query.timezone
    : TIMEZONE;
  const anchor = typeof req.query.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(req.query.date)
    ? req.query.date
    : todayInTimeZone(timezone);
  const weekStart = startOfWeekMonday(anchor);
  res.json({
    timezone,
    today: todayInTimeZone(timezone),
    weekStart,
    weekLabel: formatWeekRange(weekStart),
    days: weekDates(weekStart).map((date, index) => ({
      date,
      weekdayIndex: index,
      isToday: date === todayInTimeZone(timezone),
    })),
  });
});

app.use(
  '/images',
  express.static(imagesDir, {
    maxAge: '7d',
    immutable: false,
    fallthrough: true,
  }),
);

if (fs.existsSync(webDist)) {
  app.use(express.static(webDist, { index: false, maxAge: '1h' }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/images')) {
      next();
      return;
    }
    const indexFile = path.join(webDist, 'index.html');
    if (!fs.existsSync(indexFile)) {
      next();
      return;
    }
    res.sendFile(indexFile);
  });
} else {
  app.get('/', (_req, res) => {
    res.json({
      message: '今天吃什么 · 数据服务运行中',
      hint: 'Web 开发态请访问 Vite 地址（默认 http://127.0.0.1:5173）；生产构建后本服务会托管 apps/web/dist。',
      api: '/api/health',
    });
  });
}

app.use((req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: `接口不存在：${req.method} ${req.path}` } });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[server] unhandled error:', error);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : '服务器内部错误',
    },
  });
});

app.listen(PORT, HOST, () => {
  console.log('');
  console.log('  今天吃什么 · 数据服务');
  console.log(`  ➜ 接口地址: http://${HOST}:${PORT}/api/health`);
  console.log(`  ➜ 菜谱 ${RECIPES.length} 道 / 视频 ${VIDEOS.length} 条 / 时区 ${TIMEZONE}`);
  if (fs.existsSync(webDist)) {
    console.log(`  ➜ Web 静态站点: http://${HOST}:${PORT}/`);
  } else {
    console.log('  ➜ Web 构建产物不存在，开发态请使用 Vite（npm run dev）');
  }
  console.log('');
});

function loadEnvFile(filePath: string): void {
  const loader = (process as unknown as { loadEnvFile?: (target: string) => void }).loadEnvFile;
  if (typeof loader !== 'function') return;
  if (!fs.existsSync(filePath)) return;
  try {
    loader.call(process, filePath);
  } catch (error) {
    console.warn('[server] 读取 .env 失败:', error);
  }
}
