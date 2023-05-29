import { EventTypes } from '@web-watch/shared';
import { DeviceInfo } from '@web-watch/types';
import { Logger } from './logger';
import { UAParser } from 'ua-parser-js';
import { variableTypeDetection } from './verifyType';

// webWatch的全局变量
export interface webWatchSupport {
  logger: Logger;
  replaceFlag: { [key in EventTypes]?: boolean };
  record?: any[];
  deviceInfo?: DeviceInfo;
}

interface webWatchGlobal {
  console?: Console;
  __webWatch__?: webWatchSupport;
}

// 是否是node环境
export const isNodeEnv = variableTypeDetection.isProcess(typeof process !== 'undefined' ? process : 0);

// 是否是wx小程序
export const isWxMiniEnv =
  variableTypeDetection.isObject(typeof wx !== 'undefined' ? wx : 0) &&
  variableTypeDetection.isFunction(typeof App !== 'undefined' ? App : 0);

// 是否是浏览器环境
export const isBrowserEnv = variableTypeDetection.isWindow(typeof window !== 'undefined' ? window : 0);

// 获取全局变量
export function getGlobal<T>() {
  if (isBrowserEnv) return window as unknown as webWatchGlobal & T;
  if (isWxMiniEnv) return wx as unknown as webWatchGlobal & T;
  if (isNodeEnv) return process as unknown as webWatchGlobal & T;
}

// 全局变量
const _global = getGlobal<Window & WechatMiniprogram.Wx>();
const _support = getGlobalwebWatchSupport();

const uaResult = new UAParser().getResult(); // 用于获取设备信息
// // 获取设备信息
// _support.deviceInfo = {
//   browserVersion: uaResult.browser.version, // // 浏览器版本号 107.0.0.0
//   browser: uaResult.browser.name, // 浏览器类型 Chrome
//   osVersion: uaResult.os.version, // 操作系统 电脑系统 10
//   os: uaResult.os.name, // Windows
//   ua: uaResult.ua,
//   device: uaResult.device.model ? uaResult.device.model : 'Unknow',
//   device_type: uaResult.device.type ? uaResult.device.type : 'Pc',
// };

// 获取全局变量__webWatch__的引用地址
function getGlobalwebWatchSupport(): webWatchSupport {
  _global.__webWatch__ = _global.__webWatch__ || ({} as webWatchSupport);
  return _global.__webWatch__;
}

export { _global, _support };

// _support.replaceFlag = _support.replaceFlag || {}
// const replaceFlag = _support.replaceFlag
// export function setFlag(replaceType: EventTypes, isSet: boolean): void {
//   if (replaceFlag[replaceType]) return
//   replaceFlag[replaceType] = isSet
// }

// export function getFlag(replaceType: EventTypes): boolean {
//   return replaceFlag[replaceType] ? true : false
// }

// 是否支持history
export function supportsHistory(): boolean {
  // borrowed from: https://github.com/angular/angular.js/pull/13945/files
  const chrome = (_global as any).chrome;
  const isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
  const hasHistoryApi = 'history' in _global && !!_global.history.pushState && !!_global.history.replaceState;
  return !isChromePackagedApp && hasHistoryApi;
}


// export const isBrowserEnv = variableTypeDetection.isWindow(
//   typeof window !== 'undefined' ? window : 0
// );

// // 获取全局变量window
// export function getGlobal(): Window {
//   return window as unknown as Window;
// }
// const _global = getGlobal();
// const _support = getGlobalSupport();
// const uaResult = new UAParser().getResult(); // 用于获取设备信息

// // 获取设备信息
// _support.deviceInfo = {
//   browserVersion: uaResult.browser.version, // // 浏览器版本号 107.0.0.0
//   browser: uaResult.browser.name, // 浏览器类型 Chrome
//   osVersion: uaResult.os.version, // 操作系统 电脑系统 10
//   os: uaResult.os.name, // Windows
//   ua: uaResult.ua,
//   device: uaResult.device.model ? uaResult.device.model : 'Unknow',
//   device_type: uaResult.device.type ? uaResult.device.type : 'Pc',
// };

// // 是否报错
// _support.hasError = false;

// // errorMap 存储代码错误的集合
// _support.errorMap = new Map();
// // 订阅的信息
// _support.replaceFlag = _support.replaceFlag || {};

// const replaceFlag = _support.replaceFlag;

// export function setFlag(replaceType: string, isSet: boolean) {
//   if (replaceFlag[replaceType]) return;
//   replaceFlag[replaceType] = isSet;
// }
// export function getFlag(replaceType: string) {
//   return replaceFlag[replaceType] ? true : false;
// }

// // 获取全部变量__webWatch__的引用地址
// export function getGlobalSupport() {
//   _global.__webWatch__ = _global.__webWatch__ || ({} as WebWatch);
//   return _global.__webWatch__;
// }

// // 是否支持history
// export function supportsHistory(): boolean {
//   const chrome = _global.chrome;
//   const isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
//   const hasHistoryApi =
//     'history' in _global &&
//     !!(_global.history as History).pushState &&
//     !!(_global.history as History).replaceState;
//   return !isChromePackagedApp && hasHistoryApi;
// }

// export { _global, _support };
