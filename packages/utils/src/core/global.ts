import { UAParser } from 'ua-parser-js';
import { variableTypeDetection } from './verifyType';
import { WebWatch, Window } from '@web-watch/types';

export const isBrowserEnv = variableTypeDetection.isWindow(
  typeof window !== 'undefined' ? window : 0
);

// 获取全局变量window
export function getGlobal(): Window {
  return window as unknown as Window;
}
const _global = getGlobal();
const _support = getGlobalSupport();
const uaResult = new UAParser().getResult(); // 用于获取设备信息

// 获取设备信息
_support.deviceInfo = {
  browserVersion: uaResult.browser.version, // // 浏览器版本号 107.0.0.0
  browser: uaResult.browser.name, // 浏览器类型 Chrome
  osVersion: uaResult.os.version, // 操作系统 电脑系统 10
  os: uaResult.os.name, // Windows
  ua: uaResult.ua,
  device: uaResult.device.model ? uaResult.device.model : 'Unknow',
  device_type: uaResult.device.type ? uaResult.device.type : 'Pc',
};

// 是否报错
_support.hasError = false;

// errorMap 存储代码错误的集合
_support.errorMap = new Map();
// 订阅的信息
_support.replaceFlag = _support.replaceFlag || {};

const replaceFlag = _support.replaceFlag;

export function setFlag(replaceType: string, isSet: boolean) {
  if (replaceFlag[replaceType]) return;
  replaceFlag[replaceType] = isSet;
}
export function getFlag(replaceType: string) {
  return replaceFlag[replaceType] ? true : false;
}

// 获取全部变量__webWatch__的引用地址
export function getGlobalSupport() {
  _global.__webWatch__ = _global.__webWatch__ || ({} as WebWatch);
  return _global.__webWatch__;
}

// 是否支持history
export function supportsHistory(): boolean {
  const chrome = _global.chrome;
  const isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
  const hasHistoryApi =
    'history' in _global &&
    !!(_global.history as History).pushState &&
    !!(_global.history as History).replaceState;
  return !isChromePackagedApp && hasHistoryApi;
}

export { _global, _support };
