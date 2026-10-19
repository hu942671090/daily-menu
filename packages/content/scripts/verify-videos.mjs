#!/usr/bin/env node
/**
 * 视频核验脚本（bilibili 公开接口）
 *
 * 原则：
 * 1. 不编造 BV 号、标题、作者或链接：所有字段都来自 bilibili 官方公开接口的返回值；
 * 2. 只有「搜索候选 → view 接口确认可访问 → 标题包含菜名 → 视频页可打开」全部通过，
 *    才写入 data/videos.json 并标记 verified；
 * 3. 找不到就什么都不写，页面会显示「暂无已核验视频」，绝不拿搜索页冒充视频；
 * 4. 抖音：没有开放平台凭证时不做抓取，仅保留官方搜索页入口；
 * 5. 每次核验都写入核验时间、方式、相关性依据，数据可追溯。
 *
 * 用法：
 *   npm run videos:verify
 *   node packages/content/scripts/verify-videos.mjs --only tomato-scrambled-egg
 *   node packages/content/scripts/verify-videos.mjs --limit 5 --delay 1500
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJsonDirectory } from './lib/content-schema.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const contentRoot = path.resolve(here, '..');
const dataDir = path.join(contentRoot, 'data');
const videosPath = path.join(dataDir, 'videos.json');
const candidatesPath = path.join(dataDir, 'video-candidates.json');
const reportPath = path.resolve(contentRoot, '../../docs/video-verification.md');

const args = process.argv.slice(2);
function argValue(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
}
const ONLY = argValue('--only', '');
const IDS = argValue('--ids', '');
const LIMIT = Number(argValue('--limit', '0')) || 0;
const DELAY = Number(argValue('--delay', '1200')) || 1200;
const MAX_AGE_DAYS = Number(argValue('--max-age-days', '45')) || 45;

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const baseHeaders = {
  'User-Agent': USER_AGENT,
  Referer: 'https://www.bilibili.com/',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'zh-CN,zh;q=0.9',
};

/** 先访问首页获取平台下发的 Cookie，避免详情页被反爬策略误判 */
let cookieJar = '';
async function warmupCookies() {
  try {
    const response = await fetch('https://www.bilibili.com/', {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
      signal: AbortSignal.timeout(15000),
    });
    const cookies = typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : [];
    cookieJar = cookies.map((cookie) => cookie.split(';')[0]).join('; ');
    if (cookieJar) console.log('  已获取 bilibili 访客 Cookie（用于页面可访问性检查）');
  } catch (error) {
    console.warn(`  ⚠️ 获取访客 Cookie 失败：${error.message}`);
  }
}

function requestHeaders(extra = {}) {
  return { ...baseHeaders, ...(cookieJar ? { Cookie: cookieJar } : {}), ...extra };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(url, attempt = 1) {
  try {
    const response = await fetch(url, {
      headers: requestHeaders(),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (payload.code !== 0) throw new Error(`API code ${payload.code}: ${payload.message}`);
    return payload.data;
  } catch (error) {
    if (attempt >= 3) throw error;
    await sleep(1200 * attempt * attempt);
    return fetchJson(url, attempt + 1);
  }
}

function stripTags(value) {
  return String(value ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function normalize(value) {
  return stripTags(value).toLowerCase().replace(/\s+/g, '');
}

/** 搜索接口的 duration 是 "5:6" / "1:02:03" 形式的字符串 */
function parseDuration(value) {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;
  const parts = value.split(':').map((part) => Number(part));
  if (parts.some((part) => !Number.isFinite(part))) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] ?? 0;
}

const EXCLUDE_WORDS = [
  '探店',
  '外卖',
  '广告',
  '测评',
  '吃播',
  '挑战',
  '大胃王',
  '合集',
  'vlog',
  '开箱',
  '直播回放',
  'asmr',
  '纯享',
];

const RELEVANT_WORDS = ['做法', '教程', '家常', '怎么做', '步骤', '厨', '教学', '烹饪'];

function scoreCandidate(item, recipe) {
  const title = stripTags(item.title);
  const plain = title.toLowerCase();
  const name = recipe.name.toLowerCase();
  const normalizedTitle = normalize(title);
  if (!normalizedTitle.includes(normalize(name))) return null;
  if (EXCLUDE_WORDS.some((word) => plain.includes(word))) return null;
  const duration = parseDuration(item.duration);
  if (duration < 60 || duration > 2400) return null;

  let score = 0;
  if (title.replace(/[【\][】\s]/g, '') === recipe.name) score += 30;
  for (const word of RELEVANT_WORDS) {
    if (plain.includes(word)) score += 6;
  }
  if (/【[^】]*(做法|教程|家常)/.test(title)) score += 8;
  if (recipe.mainIngredients.some((ingredient) => plain.includes(ingredient.toLowerCase()))) score += 5;
  if (duration >= 120 && duration <= 900) score += 6;
  score += Math.min(10, Math.log10((item.play ?? 0) + 1) * 2);
  return { item: { ...item, duration }, title, score };
}

async function searchCandidates(recipe) {
  const keyword = `${recipe.name} 做法`;
  const url = `https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword=${encodeURIComponent(keyword)}&page=1`;
  const data = await fetchJson(url);
  const results = Array.isArray(data.result) ? data.result : [];
  return results
    .map((item) => scoreCandidate(item, recipe))
    .filter(Boolean)
    .sort((left, right) => right.score - left.score)
    .slice(0, 4);
}

async function verifyCandidate(candidate, recipe, attempt = 1) {
  try {
    const view = await fetchJson(
      `https://api.bilibili.com/x/web-interface/view?bvid=${encodeURIComponent(candidate.item.bvid)}`,
    );
    const title = stripTags(view.title);
    const plain = title.toLowerCase();
    if (!normalize(title).includes(normalize(recipe.name))) {
      throw new Error('view 返回的标题不包含菜名，判定为不相关');
    }
    if (EXCLUDE_WORDS.some((word) => plain.includes(word))) {
      throw new Error('view 标题命中排除词');
    }
    if (!view.owner || !view.owner.name) throw new Error('view 返回缺少作者信息');
    if (!view.bvid || !view.duration) throw new Error('view 返回缺少必要元数据');

    const pageUrl = `https://www.bilibili.com/video/${view.bvid}`;
    const pageResponse = await fetch(pageUrl, {
      headers: requestHeaders({
        Accept: 'text/html,application/xhtml+xml',
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!pageResponse.ok && pageResponse.status !== 412) {
      throw new Error(`视频页不可访问：HTTP ${pageResponse.status}`);
    }
    const pageBlocked = pageResponse.status === 412;

    return {
      record: {
        id: `bili-${view.bvid}`,
        platform: 'bilibili',
        recipeId: recipe.id,
        title: view.title,
        author: view.owner.name,
        authorId: String(view.owner.mid),
        url: pageUrl,
        platformVideoId: view.bvid,
        durationSec: view.duration,
        coverUrl: typeof view.pic === 'string' ? view.pic.replace(/^http:/, 'https:') : undefined,
        publishedAt: new Date(view.pubdate * 1000).toISOString(),
        stats: {
          view: view.stat?.view,
          like: view.stat?.like,
        },
        verification: {
          status: 'verified',
          checkedAt: new Date().toISOString(),
          method: pageBlocked
            ? 'bilibili-view-api + video-page-412-anti-bot'
            : 'bilibili-view-api + video-page-http',
          matchBasis: 'title-keyword',
          note: `view 接口可访问，标题包含菜名「${recipe.name}」${
            pageBlocked
              ? '；视频页直连返回 412（平台反爬策略），链接为标准官方 BV 地址，可在浏览器打开'
              : '；视频详情页 HTTP 200'
          }。相关性基于标题关键词与搜索排序，未逐帧核对做法。`,
        },
      },
      extra: {
        bvid: view.bvid,
        candidateTitle: candidate.title,
        searchScore: candidate.score,
        playlistCount: view.videos,
        pageStatus: pageResponse.status,
      },
    };
  } catch (error) {
    if (attempt >= 2) throw error;
    await sleep(1600);
    return verifyCandidate(candidate, recipe, attempt + 1);
  }
}

async function verifyRecipe(recipe) {
  const candidates = await searchCandidates(recipe);
  if (candidates.length === 0) {
    return { ok: false, reason: '没有标题包含菜名的候选视频', candidates: [] };
  }
  const failures = [];
  for (const candidate of candidates) {
    try {
      const result = await verifyCandidate(candidate, recipe);
      return { ok: true, ...result };
    } catch (error) {
      failures.push({ bvid: candidate.item.bvid, title: candidate.title, error: error.message });
    }
    await sleep(500);
  }
  return { ok: false, reason: failures[0]?.error ?? '候选视频全部核验失败', candidates, failures };
}

function loadExisting() {
  if (!fs.existsSync(videosPath)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(videosPath, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function isFresh(record) {
  if (!record?.verification?.checkedAt) return false;
  const age = Date.now() - Date.parse(record.verification.checkedAt);
  return Number.isFinite(age) && age >= 0 && age < MAX_AGE_DAYS * 86_400_000;
}

const entries = readJsonDirectory(path.join(dataDir, 'recipes')).map((entry) => entry.data);
let recipes = entries;
if (ONLY) recipes = recipes.filter((recipe) => recipe.id === ONLY);
if (IDS) {
  const wanted = new Set(IDS.split(',').map((id) => id.trim()).filter(Boolean));
  recipes = recipes.filter((recipe) => wanted.has(recipe.id));
}
if (LIMIT > 0) recipes = recipes.slice(0, LIMIT);

await warmupCookies();

const existing = loadExisting();
const existingByRecipe = new Map(existing.map((video) => [video.recipeId, video]));
const videos = [];
const candidatesReport = [];
const report = [];

console.log(`\n开始核验 ${recipes.length} 道菜谱的视频（bilibili 公开接口）\n`);

for (const recipe of recipes) {
  const previous = existingByRecipe.get(recipe.id);
  if (previous && isFresh(previous) && previous.verification.status === 'verified') {
    videos.push(previous);
    report.push({
      recipe: recipe.name,
      status: 'cached',
      title: previous.title,
      author: previous.author,
      url: previous.url,
      bvid: previous.platformVideoId,
    });
    console.log(`  ↺ ${recipe.name}：沿用 ${MAX_AGE_DAYS} 天内的核验记录（${previous.platformVideoId}）`);
    continue;
  }

  process.stdout.write(`  … ${recipe.name}：搜索候选`);
  try {
    const result = await verifyRecipe(recipe);
    if (result.ok) {
      videos.push(result.record);
      report.push({
        recipe: recipe.name,
        status: 'verified',
        title: result.record.title,
        author: result.record.author,
        url: result.record.url,
        bvid: result.record.platformVideoId,
        duration: result.record.durationSec,
        candidates: result.extra.candidateTitle,
      });
      console.log(
        `\r  ✔ ${recipe.name}：${result.record.platformVideoId} · ${result.record.author} · ${result.record.durationSec}s`,
      );
    } else {
      report.push({
        recipe: recipe.name,
        status: 'none',
        reason: result.reason,
        candidates: (result.candidates ?? []).map((candidate) => ({
          title: candidate.title,
          bvid: candidate.item.bvid,
        })),
      });
      console.log(`\r  ○ ${recipe.name}：暂无已核验视频（${result.reason}）`);
    }
    if (result.candidates && result.candidates.length > 0) {
      candidatesReport.push({
        recipeId: recipe.id,
        recipeName: recipe.name,
        keyword: `${recipe.name} 做法`,
        searchedAt: new Date().toISOString(),
        candidates: result.candidates.map((candidate) => ({
          bvid: candidate.item.bvid,
          title: candidate.title,
          author: candidate.item.author,
          play: candidate.item.play,
          duration: candidate.item.duration,
          url: `https://www.bilibili.com/video/${candidate.item.bvid}`,
          score: candidate.score,
          verified: Boolean(result.ok && result.record.platformVideoId === candidate.item.bvid),
        })),
      });
    }
  } catch (error) {
    report.push({ recipe: recipe.name, status: 'error', reason: error.message });
    console.log(`\r  ✖ ${recipe.name}：核验请求失败（${error.message}）`);
  }
  await sleep(DELAY);
}

// 局部核验（--only / --ids / --limit）时保留未参与本次核验的旧记录
const partialRun = Boolean(ONLY || IDS || LIMIT > 0);
const covered = new Set(videos.map((video) => video.recipeId));
if (partialRun) {
  for (const video of existing) {
    if (covered.has(video.recipeId)) continue;
    videos.push(video);
    covered.add(video.recipeId);
  }
}

videos.sort((left, right) => left.recipeId.localeCompare(right.recipeId) || left.id.localeCompare(right.id));
fs.writeFileSync(videosPath, `${JSON.stringify(videos, null, 2)}\n`, 'utf8');
fs.writeFileSync(candidatesPath, `${JSON.stringify(candidatesReport, null, 2)}\n`, 'utf8');

const verifiedCount = videos.filter((video) => video.verification.status === 'verified').length;
const videoByRecipe = new Map(videos.map((video) => [video.recipeId, video]));
const coveredRecipes = videoByRecipe.size;
const noVideo = entries.filter((recipe) => !videoByRecipe.has(recipe.id));
const runByRecipe = new Map(report.map((item) => [item.recipe, item]));

const mdRows = entries.map((recipe) => {
  const video = videoByRecipe.get(recipe.id);
  if (video) {
    const run = runByRecipe.get(recipe.name);
    return `| ${recipe.name} | ${run?.status === 'cached' ? '沿用记录' : '已核验'} | [${video.title.replace(/\|/g, '｜')}](${video.url}) | ${video.author} | ${video.platformVideoId} |`;
  }
  const run = runByRecipe.get(recipe.name);
  const status = run?.status === 'error' ? '请求失败' : '暂无';
  const reason = (run?.reason ?? '搜索无标题匹配的候选视频').replace(/\|/g, '｜');
  return `| ${recipe.name} | ${status} | ${reason} | — | — |`;
});

const md = [
  '# 视频核验报告',
  '',
  `> 由 \`npm run videos:verify\` 自动生成于 ${new Date().toISOString()}`,
  '> 数据来源：bilibili 官方公开接口（search/type、view）与视频详情页 HTTP 状态；未使用任何抓取代理或第三方聚合接口。',
  '',
  '## 核验规则',
  '',
  '1. 用「菜名 + 做法」调用 bilibili 搜索接口，只接受标题包含完整菜名的候选；',
  '2. 过滤探店、广告、合集、吃播、测评等标题，时长限制在 1–40 分钟；',
  '3. 用 view 接口核对 BV 号、标题、作者、时长、发布时间，并重新校验标题含菜名；',
  '4. 请求视频详情页：HTTP 200 视为可访问；若平台对脚本返回 412 反爬，会在记录中注明，仍以官方 view 接口可访问为准；',
  '5. 相关性判定为「标题关键词匹配」，不代表逐帧核对做法；核验时间、方式与依据写入每条记录；',
  '6. 找不到或核验失败时不写入任何视频，页面显示「暂无已核验视频」。',
  '',
  '## 结果概览',
  '',
  `- 菜谱总数：${entries.length}`,
  `- 已核验视频：${verifiedCount} 条`,
  `- 覆盖菜谱：${coveredRecipes} / ${entries.length}`,
  `- 暂无已核验视频：${noVideo.length} 道`,
  '',
  '## 逐条结果',
  '',
  '| 菜谱 | 状态 | 视频 / 原因 | 作者 | BV 号 |',
  '| --- | --- | --- | --- | --- |',
  ...mdRows,
  '',
  '## 暂无已核验视频的菜谱',
  '',
  ...(noVideo.length > 0 ? noVideo.map((recipe) => `- ${recipe.name}（\`${recipe.id}\`）`) : ['无']),
  '',
  '## 抖音',
  '',
  '抖音开放平台未提供无需授权的公开视频检索接口；本项目未配置 `DOUYIN_CLIENT_KEY` / `DOUYIN_CLIENT_SECRET`，',
  '因此没有写入任何抖音视频记录，详情页只提供明确标注的抖音搜索入口，不把搜索结果当作已匹配教程。',
  '',
  '## 说明与限制',
  '',
  '- 候选池与排除记录见 `packages/content/data/video-candidates.json`，仅用于人工复核，不在界面展示为教程；',
  '- 视频版权归原作者所有，本项目仅链接到平台原页面，不下载、不转存；',
  '- 若平台接口策略调整或视频被删除，重新运行本脚本即可更新状态；已失效链接会从展示数据中移除。',
  '',
];

fs.writeFileSync(reportPath, md.join('\n'), 'utf8');

console.log('');
console.log(`✅ 已更新 ${path.relative(process.cwd(), videosPath)}`);
console.log(`   已核验 ${verifiedCount} 条，覆盖 ${coveredRecipes} / ${entries.length} 道菜谱`);
console.log(`   候选记录 ${path.relative(process.cwd(), candidatesPath)}`);
console.log(`   核验报告 ${path.relative(process.cwd(), reportPath)}`);
if (noVideo.length > 0) {
  console.log(`   暂无视频：${noVideo.map((recipe) => recipe.name).join('、')}`);
}
