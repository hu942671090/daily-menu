# 把「今天吃什么」发布给朋友看

> 当前已部署的演示地址：<https://hu942671090.github.io/daily-menu/>
> 源码仓库：<https://github.com/hu942671090/daily-menu>（`gh-pages` 分支存放静态站）

这个项目的前端已经把 25 道菜谱、24 条视频和界面逻辑打包进了 JS，所以**不需要服务器**也能完整浏览。
只要额外把图片一起打包，上传到任意静态托管即可。

已为你准备好一条命令：

```bash
npm run build:static
```

产物：`apps/web/dist-static/`（约 10 MB，含 158 张图片）

该版本的特点是：

- 数据全部内置，关闭了 `/api` 请求，不会出现接口报错；
- 使用 hash 路由（`/#/week`、`/#/recipe/xxx`），刷新任何页面都不会 404；
- 资源使用相对路径，放在域名根目录或子目录都能正常显示；
- 访客的偏好、菜单、收藏只保存在各自浏览器的 localStorage，互不影响；
- 仍保留「版本 / 示例数据 / 示意图非实拍」等说明。

---

## 方案一：Netlify Drop（最省事，推荐先试）

适合：只想尽快发一个链接给朋友，不想折腾 Git。

1. 本地执行 `npm run build:static`；
2. 打开 <https://app.netlify.com/drop>；
3. 把 **`apps/web/dist-static` 整个文件夹**拖进页面；
4. 等待几十秒，会得到一个 `https://随机名.netlify.app` 链接；
5. 登录后可以改站点名、绑定自己的域名，也可以以后重新拖拽更新。

免费额度对个人演示足够，HTTPS 自动开启。国内访问速度视网络环境而定，可能偏慢。

---

## 方案二：Cloudflare Pages（速度与额度都不错）

适合：想要更稳定的全球访问，或以后绑定自定义域名。

1. 注册 Cloudflare，进入 **Workers & Pages → Create → Pages → Upload assets**；
2. 项目名随意填；
3. 把 `apps/web/dist-static` 里的**内容**打包成 zip 上传，或直接拖入文件夹；
4. Deploy 后得到 `https://项目名.pages.dev`。

也可以连接 GitHub 仓库自动构建，但本项目需要先复制图片再构建，直接上传 `dist-static` 更简单。

---

## 方案三：GitHub Pages（顺便开源代码）

适合：想把源码也放在 GitHub，让朋友看代码 + 看页面。

### 1. 建仓库并推送源码

```bash
cd daily-menu
git init
git add .
git commit -m "feat: 今天吃什么 · 三端菜谱推荐"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

> `.gitignore` 已排除 `node_modules`、`dist`、`dist-static`、`.env` 等，不会把依赖和密钥推上去。
> 免费账号的 Pages 通常要求仓库公开（public）。

### 2. 发布静态站

最简单的方式：把构建产物推到 `gh-pages` 分支。

```bash
npm run build:static
cd apps/web/dist-static
git init
git add .
git commit -m "deploy: static demo"
git branch -M gh-pages
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin gh-pages --force
```

然后在 GitHub 仓库 **Settings → Pages**：

- Source 选择 **Deploy from a branch**
- Branch 选择 **gh-pages**，目录选 **/ (root)**
- 保存后等待 1–2 分钟

地址是 `https://<用户名>.github.io/<仓库名>/`。
因为构建使用了 `base="./"` 和 hash 路由，子路径与刷新都不会出问题。

> 也可以直接把 `dist-static` 里的文件通过 GitHub 网页上传到 `gh-pages` 分支（文件较多，推荐命令行）。
> 国内访问 GitHub Pages 可能不稳定，发朋友前先用手机网络试一下。

---

## 方案四：Vercel / 其他静态托管

- **Vercel**：安装 CLI 后 `npx vercel deploy apps/web/dist-static --prod`，或导入仓库并把输出目录设为 `apps/web/dist-static`。
- **腾讯云 EdgeOne Pages / 阿里云 OSS / 腾讯 COS**：国内访问更快，但需要实名认证；绑定自定义域名到中国大陆节点通常需要 ICP 备案。
- **Gitee Pages**：国内平台，但免费 Pages 的可用性与审核政策会变化，使用前请先确认当前规则。

---

## 关于微信小程序

小程序**不能像网页一样只发一个链接**：

- 需要一个正式 AppID（当前工程用的是 `touristappid`）；
- 需要在微信公众平台提交审核、发布；
- 未发布前，可以把朋友加为「体验成员」，让他们扫码体验「体验版」；
- 小程序里的图片需要 HTTPS 合法域名，不能继续用 `127.0.0.1`。

如果只是想先让朋友看看效果，建议直接发 H5 链接；小程序等有 AppID 和域名后再走审核流程。

---

## 更新与注意事项

- 改了菜谱/图片后，重新执行 `npm run build:static`，再上传覆盖即可；
- 静态版没有后端，朋友之间的数据互不影响，也不会上传任何个人信息；
- 不要提交 `.env` 或任何密钥；当前项目本身不需要密钥；
- 若绑自定义域名，在托管平台里按提示配置 DNS 即可，HTTPS 一般自动签发；
- 页面中的视频会跳转到 bilibili 官方页，请遵守平台与原作者版权要求；
- 这是演示项目：配图是示意图（非实拍），请在分享时说明，避免被误认为正式上线产品。

---

## 最简操作清单

```bash
cd daily-menu
npm install
npm run data:build        # 若已有生成数据可跳过
npm run data:images       # 若已有图片可跳过
npm run build:static
```

然后把 `apps/web/dist-static` 拖到 <https://app.netlify.com/drop>，把生成的链接发给朋友即可。
