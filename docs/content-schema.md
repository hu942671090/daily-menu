# 菜谱内容规范（content schema v1）

本文件面向内容维护者。所有菜谱以 **一个 JSON 文件一道菜** 的形式放在
`packages/content/data/recipes/`，文件名与 `id` 一致（`<id>.json`）。

数据流：

```
data/recipes/*.json  ──compile-data.mjs──▶  src/generated/dataset.ts  ──▶  Web / 小程序 / API
        │
        └──validate-content.mjs（结构、枚举、图片路径、步骤编号、视频引用）
```

> 页面组件不得硬编码菜谱内容；新增或修改菜谱只需改 JSON 并重新执行
> `npm run data:build && npm run data:validate`。

## 1. 顶层字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | ✅ | 小写英文 + 连字符，全局唯一，与文件名一致 |
| `name` | string | ✅ | 菜名，2–12 个汉字为宜 |
| `subtitle` | string | ✅ | 一句话卖点，不超过 20 字 |
| `intro` | string | ✅ | 60–160 字介绍，说明风味与适合场景，不写养生功效 |
| `cuisine` | enum | ✅ | `家常菜 / 川湘 / 粤式 / 江浙 / 北方 / 西式 / 日韩 / 轻食` |
| `tastes` | enum[] | ✅ | `清淡 / 咸鲜 / 香辣 / 酸甜 / 酱香 / 鲜香 / 奶香 / 微甜 / 蒜香` |
| `mealTypes` | enum[] | ✅ | `breakfast / lunch / dinner`，至少一个 |
| `baseServings` | number | ✅ | 食材用量对应的基准人数（1–8） |
| `prepMinutes` | number | ✅ | 备料时间，分钟 |
| `cookMinutes` | number | ✅ | 烹饪时间，分钟 |
| `difficulty` | 1 \| 2 \| 3 | ✅ | 1 简单 / 2 中等 / 3 进阶 |
| `image` | ImageRef | ✅ | 成品图，见第 3 节 |
| `mainIngredients` | string[] | ✅ | 2–5 个主要食材名称，用于搜索、去重、食材复用与购物清单 |
| `allergenTags` | string[] | ✅ | 过敏原/忌口标签，用于偏好过滤；无则 `[]` |
| `ingredientGroups` | Group[] | ✅ | 必须同时有 `main`（主料）与 `seasoning`（调料） |
| `steps` | Step[] | ✅ | 至少 4 步，`index` 从 1 连续递增 |
| `tips` | string[] | ✅ | 火候、处理、时间节点等关键提示，至少 2 条 |
| `substitutions` | string[] | ✅ | 可替换食材，至少 1 条 |
| `failures` | string[] | ✅ | 常见失败原因与补救，至少 1 条 |
| `source` | Source | ✅ | 内容来源，见第 4 节 |
| `completeness` | `complete` \| `partial` | ✅ | 图文是否完整；缺步骤图必须标 `partial` 并写 `completenessNote` |
| `completenessNote` | string | 条件 | `partial` 时必填，说明缺什么 |
| `createdAt` / `updatedAt` | ISO string | ✅ | 时间戳 |

## 2. 食材与步骤

### IngredientItem

```json
{ "id": "tomato", "name": "番茄", "amount": 300, "unit": "克", "scalable": true, "note": "切滚刀块" }
```

- `amount: null` 时必须提供 `display`，例如 `"少许"`、`"适量"`、`"约 2 克（按口味）"`；
- `scalable: false` 的用量（如「少许」）不随人数换算，界面保留原文；
- 单位建议使用：`克`、`毫升`、`个`、`瓣`、`根`、`片`、`块`、`把`、`勺`、`茶匙`、`张`、`只`。

### RecipeStep

```json
{
  "index": 1,
  "title": "番茄切块、鸡蛋打散",
  "text": "……",
  "image": { "src": "/images/recipes/xxx-step-1.png", "alt": "……", "kind": "illustration", "credit": "……", "note": "示意图，非实拍" },
  "heat": "中大火",
  "timeHint": "约 1 分钟"
}
```

- 每一步 **必须** 有自己的图片路径，路径约定：
  - 成品图：`/images/recipes/<id>.png`
  - 步骤图：`/images/recipes/<id>-step-<index>.png`
- 目前项目内所有图片均为 **脚本生成的示意图**，必须带 `note: "示意图，非实拍"`，
  不得把成品图复用为步骤图，也不得声称是实拍。

## 3. 图片

`ImageRef`：

```json
{
  "src": "/images/recipes/tomato-scrambled-egg.png",
  "alt": "番茄炒蛋成品示意图：红色番茄块与金黄色鸡蛋盛在白盘中",
  "kind": "illustration",
  "credit": "本项目原创示意图（脚本绘制，非实拍）",
  "note": "示意图，非实拍"
}
```

- `kind` 只能是 `illustration` / `photo` / `placeholder`；
- 只有确实拥有授权的实拍图才能写 `photo`，并在 `credit` 写明作者与许可；
- 生成脚本 `scripts/generate_images.py` 会按 JSON 中的路径输出 PNG；
  配色由菜系决定（脚本内 `CUISINE_PALETTES`），同一菜系内再按菜谱 id 做确定性微调；
- 每张成品图、每个步骤图都是独立绘制：步骤图包含步骤编号、步骤标题、火候/时间与动作图标
  （图标根据步骤文字中的“切/炒/煮/腌/装盘”等关键词匹配），不复用封面图。

## 4. 来源

```json
"source": {
  "type": "original",
  "label": "本项目原创整理",
  "license": "CC BY 4.0（文字与示意图）",
  "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
}
```

`type` 取值：`original`（原创整理）、`curated`（人工整理/参考多篇公开做法）、
`licensed`（获得授权）、`demo`（演示数据）。**不允许**编造作者、来源链接或授权。

## 5. 视频

视频独立存放在 `data/videos.json`，通过 `recipeId` 关联菜谱；字段：

```json
{
  "id": "bv1xxxxxxxxx",
  "platform": "bilibili",
  "recipeId": "tomato-scrambled-egg",
  "title": "【真实标题】",
  "author": "真实 UP 主名称",
  "authorId": "123456",
  "url": "https://www.bilibili.com/video/BV1xxxxxxxxx",
  "platformVideoId": "BV1xxxxxxxxx",
  "durationSec": 480,
  "verification": {
    "status": "verified",
    "checkedAt": "2026-10-19T10:00:00.000Z",
    "method": "bilibili-view-api",
    "matchBasis": "title-keyword",
    "note": "链接可访问；标题包含菜名关键词，未逐帧核对做法"
  }
}
```

- 该文件由 `npm run videos:verify` 生成/更新，**不得手工编造** BV 号、标题或作者；
- 找不到匹配视频时，该菜谱保持无视频，界面显示「暂无已核验视频」；
- 平台搜索入口单独展示，必须标注「搜索页，非已匹配教程」。

## 6. 内容自检

```bash
npm run data:build      # 生成 src/generated/dataset.ts（含类型检查）
npm run data:validate   # 结构 / 枚举 / 图片 / 步骤 / 视频引用校验
npm run data:images     # 生成成品图与步骤图（需要 Python + Pillow）
```
