const { createStorageRepository } = require('./shared/bundle');
const config = require('./config/index');

/** 把 wx 同步存储适配成 shared 的 StorageLike 接口 */
const wxStorage = {
  getItem(key) {
    try {
      const value = wx.getStorageSync(key);
      return value === '' || value === undefined || value === null ? null : value;
    } catch (error) {
      console.warn('[storage] 读取失败', key, error);
      return null;
    }
  },
  setItem(key, value) {
    try {
      wx.setStorageSync(key, value);
    } catch (error) {
      console.warn('[storage] 写入失败', key, error);
    }
  },
  removeItem(key) {
    try {
      wx.removeStorageSync(key);
    } catch (error) {
      console.warn('[storage] 删除失败', key, error);
    }
  },
};

App({
  globalData: {
    repository: null,
    config,
    lastError: null,
  },

  onLaunch() {
    this.globalData.repository = createStorageRepository(wxStorage, {
      defaultTimezone: config.defaultTimezone,
    });
  },

  onError(error) {
    this.globalData.lastError = String(error);
    console.error('[app] 未捕获错误', error);
  },
});
