# 平台能力、视频接入与核验

本文记录实现前对平台能力的调研结论、最终采用的方式，以及明确的限制。
结论基于 2026-10-19 查阅的官方文档与实际接口行为；平台策略可能变化，重新核验前请再查官方文档。

## 1. 结论速览

| 端 | 视频入口形式 | 能否站内播放 | 说明 |
| --- | --- | --- | --- |
| PC 网页 | 新窗口打开 bilibili 官方视频页 | 否（未使用 iframe 嵌入） | 避免自动播放、Cookie、跨域与移动端兼容问题；官方页体验最完整 |
| 手机 H5 | 新窗口 / 系统浏览器打开官方视频页 | 否 | 同上；微信内置浏览器会跳转或提示在浏览器打开 |
| 微信小程序 | 「复制视频链接」→ 浏览器打开 | **否** | 小程序无法直接播放第三方网页视频；`web-view` 需业务域名且个人主体不支持 |

所有端都保留「搜索相关视频」入口，并与「已核验视频教程」在文案和位置上明确区分。

## 2. 微信小程序

官方文档：[web-view | 微信开放文档](https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html)

关键限制（摘自官方文档）：

- 「承载网页的容器。会自动铺满整个小程序页面，**个人类型的小程序暂不支持使用**。」
- 「可打开关联的公众号的文章，其它网页需登录小程序管理后台配置业务域名。」
- 「网页内 iframe 的域名也需要配置到域名白名单。」
- 「每个页面只能有一个 web-view，web-view 会自动铺满整个页面，并覆盖其他组件。」

因此首版**没有**用 `web-view` 包 bilibili/抖音页面：

1. 个人主体不可用，演示工程无法保证可运行；
2. 需要已备案 HTTPS 域名并完成业务域名校验，当前没有可用域名；
3. 即使配置成功，第三方页面在 web-view 内的登录、播放与跳转也不可控。

替代方案：视频卡片展示平台、真实标题、作者、时长与核验信息，提供「复制视频链接」，用户到浏览器打开原视频；页面明确说明该限制。

## 3. bilibili

### 使用的公开接口

| 用途 | 接口 |
| --- | --- |
| 搜索候选 | `https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword=...` |
| 校验元数据 | `https://api.bilibili.com/x/web-interface/view?bvid=...` |
| 链接可访问性 | `https://www.bilibili.com/video/<BV号>`（HTTP 状态） |
| 播放页 | `https://www.bilibili.com/video/<BV号>` |

`player.bilibili.com/player.html?bvid=...` 是公开的 iframe 播放地址，但本项目未使用：嵌入会引入自动播放控制、Referer/Cookie 策略与移动端全屏行为等额外问题，而「打开官方页」在三个端都稳定可解释。

### 反爬与核验策略

- 脚本先访问 bilibili 首页获取访客 Cookie，再进行搜索与详情页请求；
- 首次批量核验时，个别详情页返回 **HTTP 412**（平台反爬）；带 Cookie 后重试成功；
- 若详情页仍返回 412，会在记录的 `verification.method/note` 中注明「页面直连 412，以 view 接口可访问为准」，不会伪装成普通 200；
- 所有请求串行并带延迟（默认 0.8–1.2 秒），失败退避重试，避免给平台造成压力。

### 视频记录字段

```json
{
  "id": "bili-BV1Tf4y1q7gW",
  "platform": "bilibili",
  "recipeId": "braised-pork",
  "title": "真实标题（接口原样返回）",
  "author": "真实 UP 主名称",
  "authorId": "UP 主 mid",
  "url": "https://www.bilibili.com/video/BV1Tf4y1q7gW",
  "platformVideoId": "BV1Tf4y1q7gW",
  "durationSec": 211,
  "coverUrl": "https://i0.hdslb.com/...",
  "publishedAt": "2020-11-11T13:35:08.000Z",
  "stats": { "view": 3697766, "like": 80425 },
  "verification": {
    "status": "verified",
    "checkedAt": "2026-10-19T07:27:45.222Z",
    "method": "bilibili-view-api + video-page-http",
    "matchBasis": "title-keyword",
    "note": "view 接口可访问，标题包含菜名「红烧肉」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
  }
}
```

- `status`：`verified` / `link-broken` / `unverified`；
- `matchBasis`：`title-keyword` / `manual-review` / `platform-metadata`；
- 界面展示核验日期、方式说明和「未逐帧核对做法」的提示；
- **不编造** BV 号、标题、作者或封面；数据缺失时宁可不展示。

### 候选池

`packages/content/data/video-candidates.json` 保存每次搜索的候选与排除理由，仅用于人工复核，**不会**作为教程在界面展示。

## 4. 抖音

- 抖音开放平台（<https://developer.open-douyin.com/>）的视频检索/管理能力需要应用凭证与授权，未提供无需授权的公开搜索接口；
- 当前未配置 `DOUYIN_CLIENT_KEY` / `DOUYIN_CLIENT_SECRET`，因此**没有任何抖音视频记录**；
- 详情页只提供抖音搜索页入口，文案明确「打开的是平台搜索结果页，并非已匹配的视频」；
- 后续接入需：开放平台应用、OAuth 授权、用户/视频数据权限审核，并在服务端完成签名与缓存。

## 5. 搜索页与视频教程的区分

| 展示位置 | 内容 | 文案 |
| --- | --- | --- |
| 视频教程列表 | 已核验的具体视频 | 标题、作者、平台、时长、核验状态、打开原视频 |
| 视频教程为空 | 明确空状态 | 「暂无已核验视频」+ 不编造链接的说明 |
| 搜索入口 | 平台搜索页 | 「搜索相关视频」+「打开的是平台搜索结果页，并非已匹配的视频」 |

这样即使用户点击搜索入口，也不会误以为已经找到了对应教程。

## 6. 上线前需要完成

1. 注册并配置正式小程序 AppID，替换 `project.config.json` 的 `touristappid`；
2. 配置已备案 HTTPS 域名，加入小程序 request/downloadFile 合法域名（若使用 web-view，还需业务域名与校验文件）；
3. 人工抽检 24 条已核验视频的做法相关性，把 `matchBasis` 升级为 `manual-review` 并记录复核人；
4. 补充抖音开放平台凭证与授权流程，或继续只保留搜索入口；
5. 确认视频链接的长期有效性（脚本重跑即可更新 `link-broken` 状态）；
6. 为视频封面/内容准备版权说明，避免二次分发。
