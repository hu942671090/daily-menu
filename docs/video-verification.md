# 视频核验报告

> 由 `npm run videos:verify` 自动生成于 2026-10-19T07:28:19.055Z
> 数据来源：bilibili 官方公开接口（search/type、view）与视频详情页 HTTP 状态；未使用任何抓取代理或第三方聚合接口。

## 核验规则

1. 用「菜名 + 做法」调用 bilibili 搜索接口，只接受标题包含完整菜名的候选；
2. 过滤探店、广告、合集、吃播、测评等标题，时长限制在 1–40 分钟；
3. 用 view 接口核对 BV 号、标题、作者、时长、发布时间，并重新校验标题含菜名；
4. 请求视频详情页：HTTP 200 视为可访问；若平台对脚本返回 412 反爬，会在记录中注明，仍以官方 view 接口可访问为准；
5. 相关性判定为「标题关键词匹配」，不代表逐帧核对做法；核验时间、方式与依据写入每条记录；
6. 找不到或核验失败时不写入任何视频，页面显示「暂无已核验视频」。

## 结果概览

- 菜谱总数：25
- 已核验视频：24 条
- 覆盖菜谱：24 / 25
- 暂无已核验视频：1 道

## 逐条结果

| 菜谱 | 状态 | 视频 / 原因 | 作者 | BV 号 |
| --- | --- | --- | --- | --- |
| 红烧肉 | 已核验 | [终于等到你，颤悠的红烧肉！国宴大厨揭秘家常版做法~](https://www.bilibili.com/video/BV1Tf4y1q7gW) | 老饭骨 | BV1Tf4y1q7gW |
| 皮蛋瘦肉粥 | 已核验 | [这才是皮蛋瘦肉粥的家常做法，浓稠香滑，鲜香味美喝它养胃又解馋](https://www.bilibili.com/video/BV1FV4y1c77K) | 品味厨记 | BV1FV4y1c77K |
| 蔬菜鸡蛋饼 | 已核验 | [妈妈们学会这个蔬菜鸡蛋饼！孩子一周的早餐都搞定！做法食材都很简单，营养也特别丰富！#蔬菜鸡蛋饼 #早餐吃什么 #早餐饼](https://www.bilibili.com/video/BV1ZQAheJENh) | 夏叔有好货 | BV1ZQAheJENh |
| 鱼香茄子 | 沿用记录 | [鱼香茄子](https://www.bilibili.com/video/BV1p6VZ6MEGm) | 阿虎美食记 | BV1p6VZ6MEGm |
| 蒜蓉西兰花 | 已核验 | [蒜蓉西兰花，炒之前多加一个步骤，做出来脆嫩入味，营养不流失](https://www.bilibili.com/video/BV1K3411J7cj) | 超子美食 | BV1K3411J7cj |
| 蒜蓉粉丝蒸虾 | 已核验 | [蒜蓉粉丝蒸虾 ｜ 新年简单硬菜、零难度、超好吃！](https://www.bilibili.com/video/BV1sP6SYREpE) | 何时下厨 | BV1sP6SYREpE |
| 青椒肉丝 | 已核验 | [我做的“青椒肉丝”很好吃！步骤清晰详细、做法易学接地气](https://www.bilibili.com/video/BV1xS4y167Qe) | 美食强 | BV1xS4y167Qe |
| 火腿芝士三明治 | 已核验 | [法国人把火腿芝士三明治，做成了百年经典](https://www.bilibili.com/video/BV14xHz65Eww) | 奥路北山 | BV14xHz65Eww |
| 手撕包菜 | 已核验 | [手撕包菜](https://www.bilibili.com/video/BV1KiMB6rERm) | 跟着伯通吃好饭 | BV1KiMB6rERm |
| 宫保鸡丁 | 已核验 | [大厨教你宫保鸡丁家常做法，步骤详细，糊辣酸甜，好吃解馋超下饭](https://www.bilibili.com/video/BV1ai4y1o7EL) | 超子美食 | BV1ai4y1o7EL |
| 麻婆豆腐 | 已核验 | [【麻婆豆腐保姆级教程】](https://www.bilibili.com/video/BV1md3NzzEnF) | 村驴 | BV1md3NzzEnF |
| 小米南瓜粥 | 已核验 | [熬粥，最怕熬成一锅稀饭，没有粘稠度没有悬浮感，老师傅教你小米南瓜粥的做法~](https://www.bilibili.com/video/BV15gtKeBERk) | 品诺美食开课啦 | BV15gtKeBERk |
| 燕麦牛奶粥 | 已核验 | [口感丰富又营养的谷物燕麦牛奶粥，不用浸泡豆子，不用看火，直接用电饭锅煮，软糯可口，大人孩子孩子都爱吃#小喵麻麻甜品 #杂粮粥#电饭煲](https://www.bilibili.com/video/BV1FjQgYeEc6) | 小喵麻麻来了 | BV1FjQgYeEc6 |
| 蚝油生菜 | 已核验 | [蚝油生菜](https://www.bilibili.com/video/BV12Ucvz8EFv) | 小鹏教做菜 | BV12Ucvz8EFv |
| 香煎三文鱼 | 沿用记录 | [香煎三文鱼](https://www.bilibili.com/video/BV1CR4y167GP) | 小铁日食记 | BV1CR4y167GP |
| 土豆炖排骨 | 已核验 | [土豆炖排骨保姆级教程](https://www.bilibili.com/video/BV1Wsem6cExe) | 大庆是个厨 | BV1Wsem6cExe |
| 葱油拌面 | 已核验 | [教程丨厨者王波·认真做菜 葱油拌面！全网最详细教程！毫无保留，拿去开店都ok！真正在家也能实现葱油拌面自由啦！](https://www.bilibili.com/video/BV1rnQ2YiEKE) | 厨者王波 | BV1rnQ2YiEKE |
| 清蒸鲈鱼 | 已核验 | [为啥广东人做的清蒸鲈鱼那么好吃？大厨教你正确做法，鲜嫩无腥味](https://www.bilibili.com/video/BV1oytPeiE8N) | 天天相见厨房阿鹏 | BV1oytPeiE8N |
| 照烧鸡腿饭 | 已核验 | [【保姆级教程】如何做出超越吉野家的照烧鸡腿饭？](https://www.bilibili.com/video/BV1eT4y1o7Yv) | 简简厨房 | BV1eT4y1o7Yv |
| 三鲜水饺 | 已核验 | [素三鲜水饺 一口邂逅虾 再口喜家得 接着会想家](https://www.bilibili.com/video/BV1nr4y1W724) | xiaoyu小魚来了 | BV1nr4y1W724 |
| 番茄牛腩 | 已核验 | [全程不加一滴水！番茄牛腩保姆级超详细教程](https://www.bilibili.com/video/BV1AmamzBEvy) | 袁锐-萌新的圆 | BV1AmamzBEvy |
| 番茄牛肉面 | 已核验 | [随便吃个番茄牛肉面](https://www.bilibili.com/video/BV1YFuR6PEYh) | 想长胖滴小猪猪 | BV1YFuR6PEYh |
| 番茄炒蛋 | 沿用记录 | [番茄炒蛋](https://www.bilibili.com/video/BV1yTn36fEXd) | 番茄马自达 | BV1yTn36fEXd |
| 冬瓜丸子汤 | 已核验 | [三伏天喝“冬瓜丸子汤”，不用料酒不用淀粉，丸子嫩如豆腐不松散](https://www.bilibili.com/video/BV1H34y1J7EZ) | 周妈妈美食 | BV1H34y1J7EZ |
| 酸奶水果燕麦碗 | 暂无 | 没有标题包含菜名的候选视频 | — | — |

## 暂无已核验视频的菜谱

- 酸奶水果燕麦碗（`yogurt-fruit-bowl`）

## 抖音

抖音开放平台未提供无需授权的公开视频检索接口；本项目未配置 `DOUYIN_CLIENT_KEY` / `DOUYIN_CLIENT_SECRET`，
因此没有写入任何抖音视频记录，详情页只提供明确标注的抖音搜索入口，不把搜索结果当作已匹配教程。

## 说明与限制

- 候选池与排除记录见 `packages/content/data/video-candidates.json`，仅用于人工复核，不在界面展示为教程；
- 视频版权归原作者所有，本项目仅链接到平台原页面，不下载、不转存；
- 若平台接口策略调整或视频被删除，重新运行本脚本即可更新状态；已失效链接会从展示数据中移除。
