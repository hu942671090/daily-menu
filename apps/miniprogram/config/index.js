/**
 * 小程序运行时配置
 *
 * - assetBaseUrl：示意图资源地址。开发态默认指向本机数据服务（需在开发者工具中
 *   勾选「不校验合法域名」）；正式环境请改为已备案的 HTTPS 域名。
 * - 数据默认使用随包内置的示例数据（与 Web/H5 同一份内容源），无需网络即可体验；
 *   如后续接入远程内容，可在 utils/app-data.js 中替换为 wx.request。
 */
module.exports = {
  version: '0.1.0',
  dataMode: 'bundled',
  assetBaseUrl: 'http://127.0.0.1:4000',
  apiBaseUrl: 'http://127.0.0.1:4000',
  defaultTimezone: 'Asia/Shanghai',
};
