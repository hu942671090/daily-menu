# 架构与数据设计

## 1. 总体结构

```
                 ┌──────────────────────────────┐
                 │  packages/content (JSON 内容) │
                 │  recipes / videos / images    │
                 └──────────────┬───────────────┘
                                │ compile-data.mjs（校验 + 生成 TS）
                                ▼
                 ┌──────────────────────────────┐
                 │ packages/content/src/index.ts │  内容访问层
                 │ search / videos / stats       │
                 └──────────────┬───────────────┘
                                │ 类型与函数复用
                 ┌──────────────▼───────────────┐
                 │      packages/shared          │  领域层（唯一实现）
                 │ types / date / recommendation │
                 │ menu / shopping / store / sync│
                 └───────┬───────────┬───────────┘
                         │           │
        ┌────────────────▼──┐   ┌────▼────────────────┐   ┌─────────────────────┐
        │ apps/web (React)  │   │ apps/server (API)   │   │ apps/miniprogram    │
        │ PC + H5           │   │ 内容 + 无状态计算    │   │ 原生页面 + bundle.js │
        └───────────────────┘   └─────────────────────┘   └─────────────────────┘
```

### 为什么这样分层

| 关注点 | 放置位置 | 原因 |
| --- | --- | --- |
| 推荐规则、菜单操作、份量换算、日期 | `packages/shared` | 三端必须行为一致；只有一份实现才能保证“今日推荐 = 周菜单” |
| 内容读取、搜索、视频关联 | `packages/content` | 页面不直接 `import` JSON；未来切换 CMS/API 只改这一层 |
| 页面展示与交互 | `apps/web`、`apps/miniprogram` | 平台差异只存在于 UI 与存储适配 |
| HTTP 接口 | `apps/server` | 复用 shared/content；为后续账号同步与第三方接入预留 |

### 关于 workspace

工作区位于 SMB 共享目录，符号链接被系统拒绝（`EPERM`），因此：

- 不使用 pnpm/npm workspace，而是单包 + `tsconfig`/Vite 路径别名（`@daily-menu/shared`、`@daily-menu/content`）；
- 服务端与小程序通过 esbuild 打包共享代码，产物分别为 `apps/server/dist/index.js` 与 `apps/miniprogram/shared/bundle.js`；
- 代码仍按 `packages/*`、`apps/*` 组织，迁移到本地磁盘后可平滑改成真正的 workspace。

## 2. 数据模型

定义在 `packages/shared/src/types.ts`，由内容校验器与构建脚本共同约束。

### Recipe（菜谱）
| 字段 | 说明 |
| --- | --- |
| `id` / `name` / `subtitle` / `intro` | 标识与展示文案 |
| `cuisine` / `tastes` / `mealTypes` | 分类、口味、适用餐次 |
| `baseServings` / `prepMinutes` / `cookMinutes` / `difficulty` | 份量基准与耗时难度 |
| `image` | 成品图（含 `kind/credit/note`，示意图必须标注） |
| `mainIngredients` | 主要食材，用于搜索、去重、食材复用 |
| `allergenTags` | 过敏原/忌口分类，用于硬过滤 |
| `ingredientGroups` | `main` / `seasoning` 两组，每项含数量、单位、是否可换算 |
| `steps` | 有顺序的步骤，每步有独立图片、火候、时间节点 |
| `tips` / `substitutions` / `failures` | 关键提示、替换、失败原因 |
| `source` / `completeness` / `completenessNote` | 来源、许可、完善度 |
| `createdAt` / `updatedAt` | 时间戳 |

### 其他对象
- **IngredientItem**：`amount: null` 表示「少许 / 适量」，此时必须提供 `display`；`scalable=false` 不随人数换算。
- **RecipeStep**：`index` 从 1 连续；`image` 独立且不得与封面相同。
- **RecipeVideo**：`platform`、`title`、`author`、`url`、`platformVideoId`、`recipeId`、`verification`（状态/时间/方式/相关性依据）。
- **Preferences**：人数、菜系、口味、忌口、过敏原、不喜欢、最大耗时、难度、时区、版本。
- **WeekMenu**：`weekStart`（周一）、`timezone`、7 天 × 3 餐的 `MenuDish`、`preferences` 快照、时间戳。
- **MenuDish**：`recipeId`、`locked`、`origin`、`addedAt`、`reasons`（推荐理由快照）。
- **FavoriteRecord**：`recipeId` + `createdAt`。
- **ShoppingListItem**：合并键 `name|unit`、数量、文字用量、来源菜谱、勾选状态。

## 3. 推荐引擎（rules-v1）

实现：`packages/shared/src/recommendation.ts`。

### 过滤
```text
候选 = 全部菜谱
  − 已排除（换一道时的当前菜）
  − 餐次不匹配
  − 命中过敏原 / 忌口 / 不喜欢食材或 allergenTags
  − 总耗时 > 可接受耗时（硬约束）
  − 难度不在可接受集合（硬约束）
```

### 打分（满分不封顶，取相对排名）
| 因素 | 分值 |
| --- | --- |
| 菜系命中偏好 | +22 |
| 口味命中（最多 2 项） | +9 / 项 |
| 时间宽裕度 | 0–10 |
| 难度命中偏好 | +5（难度 1 额外给出理由） |
| 复用本周已用主要食材 | +3 / 项，最多 +9 |
| 本周已出现该菜 | −45 / 次 |
| 同菜系在本周已出现 | −7 / 次（最多 −21） |
| 同餐其他菜共享主要食材 | −6 / 项 |
| 确定性抖动 | 0–5（由“种子 + 菜谱 id”生成） |

### 生成流程
1. 以周一种子（`weekStart + preferences.updatedAt`）初始化上下文；
2. 按 周一→周日、早餐→午餐→晚餐 顺序填充；
3. 每餐优先选“本周未出现”的菜，候选不足时才允许重复；
4. 锁定菜作为已用菜参与去重，槽位配额 = 目标道数 − 锁定数；
5. 候选不足时依次放宽难度、耗时（×1.5），并记录 `relaxedNotes`；
6. 每道菜返回 `reasons`，写入菜单快照供界面展示。

### 可复现
- 同样的 `weekStart + preferences + seed` 必得同样结果（单元测试覆盖）；
- 只有用户主动操作才引入新种子（`Date.now()`），刷新页面不会改变已保存菜单。

### 扩展点
```ts
export interface RecommendationStrategy {
  id: string;
  label: string;
  description: string;
  recommend(input: RecommendationInput): RecommendationResult;
}

registerStrategy(myStrategy);
recommendWithStrategy('ai-v1', input);
```
服务端 `GET /api/meta` 会列出已注册策略；页面与持久化无需改动。

## 4. 日期与时区

`packages/shared/src/date.ts`：

- 菜单日期统一使用目标时区的 `YYYY-MM-DD`；
- 默认 `Asia/Shanghai`，`Preferences.timezone` 可覆盖；
- `todayInTimeZone()` / `startOfWeekMonday()` / `weekDates()` 基于 `Intl.DateTimeFormat`；
- 小程序基础库若不支持 `Intl` 时区能力，回落到固定偏移表（UTC、上海、香港、新加坡、东京）或设备本地时间；伦敦/纽约在无 `Intl` 环境下可能受夏令时影响，已在文档中标注；
- 日期运算使用 UTC 零点，避免宿主时区与夏令时干扰。

## 5. 持久化

`packages/shared/src/store.ts` 定义 `StorageLike` 与 `DailyMenuRepository`：

| Key | 内容 |
| --- | --- |
| `dm.v1.preferences` | 偏好（含 schemaVersion、updatedAt） |
| `dm.v1.favorites` | 收藏数组 |
| `dm.v1.menus` | `{ [weekStart]: WeekMenu }` |
| `dm.v1.shopping` | `{ [weekStart]: { [itemKey]: boolean } }` |
| `dm.v1.meta` | 安装/最后打开时间 |

- Web/H5：`window.localStorage` 适配；
- 小程序：`wx.getStorageSync / setStorageSync` 适配；
- 读取时做 `sanitize*`：非法人数收敛到 1–12，非法时区回落，缺天菜单自动补齐 7 天，损坏 JSON 回退默认值；
- 导出/导入快照（`exportSnapshot` / `importSnapshot`）用于备份；
- 账号同步：实现 `AccountSyncAdapter`（`packages/shared/src/sync.ts`）即可，当前注入的是 no-op。

## 6. 数据服务

`apps/server/src/index.ts`，Express + 共享逻辑；无状态、不保存用户数据。

```bash
curl http://127.0.0.1:4000/api/health
curl "http://127.0.0.1:4000/api/recipes?q=番茄&meals=lunch&maxMinutes=30"
curl http://127.0.0.1:4000/api/recipes/tomato-scrambled-egg
```

`POST /api/menu/recommend`：

```json
{
  "weekStart": "2026-10-19",
  "preferences": {
    "servings": 2,
    "cuisines": ["家常菜"],
    "tastes": ["咸鲜"],
    "allergens": ["花生"],
    "maxCookMinutes": 45,
    "difficulties": [1, 2],
    "timezone": "Asia/Shanghai"
  },
  "seed": "optional-seed"
}
```

响应包含 `menu`（7 天）、`weekLabel`、`days`。`POST /api/menu/regenerate-slot` 接收 `menu + date + meal + preferences`，返回保留锁定的新菜单；`POST /api/shopping-list` 返回合并后的清单。

服务端还会在存在 `apps/web/dist` 时同源托管 Web 页面（SPA fallback），并托管 `packages/content/images`。

## 7. 内容构建与校验

```
data/recipes/*.json
        │ validate-content.mjs（结构、枚举、图片路径、步骤编号、来源、视频引用）
        ▼
compile-data.mjs → src/generated/dataset.ts（带 Recipe[] / RecipeVideo[] 类型）
        │
        ├─ Vite 打包进 Web
        ├─ esbuild 打包进 server
        └─ esbuild 打包成 miniprogram/shared/bundle.js
```

内容维护流程：改 JSON → `npm run data:build` → `npm run data:validate` →（新增菜谱）`npm run data:images` → 提交。

## 8. 前端状态与数据源

- `AppProvider` 负责启动、偏好、收藏、菜单集合与所有动作；
- 启动时优先请求 `/api/content`（4 秒超时），失败则使用打包进前端的同一份内容，并在侧栏显示「离线模式 · 内置示例数据」；
- 菜单按 `weekStart` 懒加载，生成/修改后立即持久化；
- 换一道、重新生成等动作全部调用共享函数，不在组件内重写规则；
- 页面组件不硬编码菜谱内容。

## 9. 小程序复用方式

`apps/miniprogram/scripts/build-data.mjs` 以 `shared/entry.ts` 为入口，把 `@daily-menu/shared` 与 `@daily-menu/content` 打成一个 CommonJS 文件：

- 页面通过 `utils/app-data.js` 调用同一套 `createWeekMenu` / `fillSlot` / `buildShoppingList` / `createStorageRepository`；
- 内容随包内置，无网络也能体验；示意图从 `assetBaseUrl` 加载；
- 逻辑层已用 Node 模拟环境验证（见 `docs/verification.md`）。

## 10. 安全与密钥

- 仓库不含任何真实密钥；`.env` 被忽略，仅提供 `.env.example`；
- 服务端只读取环境变量，不把密钥下发给前端；
- 抖音开放平台凭证、智能推荐网关地址均为预留配置，未配置时相关功能不可用且会在界面说明。
