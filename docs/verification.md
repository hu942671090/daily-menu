# 验证报告

验证时间：2026-10-19（Asia/Shanghai）
运行环境：Windows + Node.js 24.21.0 + npm 8.19.2，浏览器为 Microsoft Edge（Chromium，`msedge.exe`），工作区位于 SMB 共享目录。

一键复现：

```bash
npm install
npm run data:build
npm run data:images
npm run data:validate
npm test
npm run typecheck
npm run verify:mp
npm run build
npm start            # 另开终端
npm run verify:e2e
```

## 一、结果总览

| 检查 | 命令 | 结果 |
| --- | --- | --- |
| 内容数据 | `npm run data:validate` | ✅ 25 道菜谱、24 条视频、0 错误 |
| 共享逻辑单元测试 | `npm test` | ✅ 30 / 30 |
| 类型检查 | `npm run typecheck` | ✅ Web + 服务端 |
| 小程序工程与页面逻辑 | `npm run verify:mp` | ✅ 13 / 13 |
| PC/H5 浏览器端到端 | `npm run verify:e2e` | ✅ 47 / 47 |
| 全量构建 | `npm run build` | ✅ Web / 服务端 / 小程序共享包 |
| 开发模式 | `npm run dev` | ✅ Vite 5173、API 4000、`/images` 代理均返回 200（SMB 下使用轮询监听） |
| 视频核验 | `npm run videos:verify` | ✅ 24 条已核验，覆盖 24 / 25 道菜谱 |
| 图片生成 | `npm run data:images` | ✅ 158 张（25 张成品 + 133 张步骤） |
| 静态发布构建 | `npm run build:static` | ✅ 10.3 MB，含 158 张图；hash 路由、无 `/api` 请求、图片可加载 |

## 二、内容数据

```
菜谱文件：25
视频记录：24（已核验 24）
有视频的菜谱：24 / 25
餐次覆盖：早餐 7｜午餐 11｜晚餐 15
菜系：家常菜、粤式、川湘、西式、轻食、北方、江浙、日韩
```

校验内容包括：字段与枚举、食材 id 唯一、`amount: null` 必须带 `display`、步骤编号连续、每步独立图片路径、来源字段、视频平台/链接/BV 号一致、核验时间不能是未来时间。图片存在性在生成后复检。

## 三、共享逻辑单元测试（30 项）

覆盖：

- 时区边界（上海跨日、纽约跨日、非法时区回落）；
- 周一为周起点、跨月、中文日期与时长格式；
- 份量换算（克/个/勺取整、`scalable=false`、少许保留文字）；
- 过敏原/忌口/不喜欢排除、超时排除、难度过滤；
- 相同种子完全可复现、每餐道数与同餐去重、推荐理由非空；
- 锁定保留、单道替换不影响其他菜、添加/移除、锁定快照；
- 今日判断（跨周回落周一）、菜单概览；
- 候选不足时的说明；
- 购物清单合并、人数换算、日期过滤、勾选统计；
- 持久化：偏好收敛、收藏去重、菜单损坏修复、按周勾选、损坏 JSON 回退、快照往返、脏数据校验。

## 四、小程序检查（13 项）

`npm run verify:mp` 用 Node 模拟 `wx` / `Page` / `getApp` 环境，加载**真实页面 JS** 与共享 bundle：

1. 所有页面 js/json/wxml/wxss 齐全；
2. tabBar 图标存在；
3. 共享 bundle 含 25 道菜与 24 条视频；
4. WXML 标签闭合；
5. 首页加载今日三餐并持久化菜单；
6. 「换一道」只替换目标菜；
7. 锁定后「换一餐」保留锁定菜；
8. 切换下一周、生成并恢复；
9. 详情人数换算、收藏、加入今日菜单；
10. 发现页搜索与筛选；
11. 收藏页读取与取消；
12. 偏好保存后重新读取生效，并按新偏好重新生成；
13. 购物清单合并、勾选持久化、复制文本。

> 注意：这是逻辑层验证，不等同于微信开发者工具/真机渲染验证。真实小程序预览仍需按 README 导入工程。

## 五、浏览器端到端（47 项）

工具：`playwright-core` + 本机 Edge，视口 1440×960 与 390×844（DPR 2，移动模拟）。

| 分组 | 验证内容 |
| --- | --- |
| 首页 | 标题、三个餐次、菜单写入本地、卡片数量、今日推荐与菜单按菜谱 id 逐道一致、刷新后推荐与菜单不变 |
| 换一道 | 目标菜改变、其他餐次不变 |
| 周菜单 | 7 天 × 3 餐、锁定写入、重新生成保留锁定、生成后仍 7 天、替换弹窗、选择后生效、保存后仍在本地 |
| 详情 | 步骤 ≥ 4、每步有图、编号与图注对应、人数换算改变用量、人数显示、视频模块有内容或明确空状态、视频含作者与核验信息、搜索入口标注非教程 |
| 收藏 | 收藏后列表出现、刷新后仍在 |
| 偏好 | 保存写入本地、刷新后选中状态保持 |
| 发现 | 搜索「番茄」有结果且与关键词相关 |
| 购物清单 | 合并项展示、勾选后刷新保留 |
| 异常 | 不存在的菜谱展示空状态；无未捕获 JS 错误 |
| 手机端 | `/`、`/week`、`/recipe/:id`、`/preferences`、`/shopping` 均无横向溢出；`.btn`、`.icon-btn`、底部导航、勾选框高度 ≥ 36px；底部导航 5 项且可切换；**H5 可完成「换一道」与人数换算** |

产物：
- `artifacts/e2e-report.json`（逐项结果与时间）
- `artifacts/*.png`（PC/H5 全页截图）
- 精选截图已复制到 `docs/screenshots/`

## 六、视频核验

```bash
npm run videos:verify
```

- 24 条全部为 `status: "verified"`，平台均为 bilibili；
- 每条包含真实标题、作者、BV 号、时长、发布时间、播放/点赞数、核验时间与方式；
- 核验方法：搜索接口 → view 接口 → 视频页 HTTP；
- 1 道菜谱无匹配：**酸奶水果燕麦碗**（界面显示「暂无已核验视频」）；
- 详情见 [video-verification.md](video-verification.md)，候选池见 `packages/content/data/video-candidates.json`。

## 七、接口烟雾测试

| 请求 | 结果 |
| --- | --- |
| `GET /api/health` | 25 道菜 / 24 条视频 / 24 条已核验 |
| `GET /api/meta` | 8 个菜系、分类与策略正确 |
| `GET /api/recipes?q=番茄&meals=lunch&maxMinutes=30` | 返回匹配结果 |
| `POST /api/menu/recommend` | 7 天、35 道、偏好快照正确 |
| `POST /api/shopping-list` | 34 项合并结果（3 人份、单日） |
| `GET /api/recipes/not-exists` | 404 JSON |
| 静态图片 `/images/recipes/*.png` | 200，`image/png` |

## 八、界面截图

- `docs/screenshots/pc-home.png`：PC 首页（今日推荐）
- `docs/screenshots/pc-week.png`：PC 周菜单（7 天 × 3 餐）
- `docs/screenshots/pc-detail.png`：PC 菜谱详情（步骤 + 视频 + 来源）
- `docs/screenshots/pc-discover.png`：PC 发现页搜索
- `docs/screenshots/pc-preferences.png`：PC 偏好设置
- `docs/screenshots/pc-shopping.png`：PC 购物清单
- `docs/screenshots/h5-home-view.png`、`h5-week-view.png`、`h5-detail-view.png`、`h5-steps-view.png`：390×844 视口截图（README 使用）
- `docs/screenshots/h5-home.png`、`h5-week.png`、`h5-detail.png`、`h5-preferences.png`、`h5-shopping.png`：H5 全页截图

## 九、未验证 / 需人工确认

1. 未在微信开发者工具中编译预览，未真机运行；未验证 iOS/Android 微信内的图片域名、字体与滚动表现。
2. 未在 Safari/iOS 浏览器验证；本轮仅 Chromium（Edge）。
3. 未部署公网，未验证 HTTPS、CDN、跨域白名单与小程序合法域名。
4. 视频只做「链接可访问 + 标题含菜名」核验，没有逐帧核对做法；建议上线前人工抽检。
5. 图片全部为示意图，未验证实拍图替换后的裁切与加载性能。
6. 未做无障碍（屏幕阅读器）与低端机性能测试。
