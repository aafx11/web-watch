import { BrowserBreadcrumbTypes, BrowserEventTypes } from "./browser";
import { WxBreadcrumbTypes, WxEventTypes } from "./wx";

// 用户行为栈事件类型
export type BreadcrumbTypes = BrowserBreadcrumbTypes | WxBreadcrumbTypes | BaseBreadcrumbTypes;

// 基础事件类型
export const enum BaseBreadcrumbTypes {
  VUE = 'Vue',
  REACT = 'React'
}

// 用户行为类型
export const enum BREADCRUMBCATEGORYS {
  HTTP = 'http',
  USER = 'user',
  DEBUG = 'debug',
  EXCEPTION = 'exception',
  LIFECYCLE = 'lifecycle'
}

// http请求类型
export const enum HttpTypes {
  XHR = 'xhr',
  FETCH = 'fetch'
}

// 上报错误类型
export const enum ErrorTypes {
  UNKNOWN = 'UNKNOWN',
  UNKNOWN_FUNCTION = 'UNKNOWN_FUNCTION',
  JAVASCRIPT = 'JAVASCRIPT',
  LOG = 'LOG',
  HTTP = 'HTTP',
  VUE = 'VUE',
  REACT = 'REACT',
  RESOURCE = 'RESOURCE',
  PROMISE = 'PROMISE',
  ROUTE = 'ROUTE'
}

// 所有重写事件类型整合
export type EventTypes = BrowserEventTypes | WxEventTypes | BaseEventTypes

export const enum BaseEventTypes {
  VUE = 'vue'
}

export const webWatchLog = 'webWatch.log'
export const webWatchLogEmptyMsg = 'empty.msg'
export const webWatchLogEmptyTag = 'empty.tag'

// 类型字符串枚举
export const enum ToStringTypes {
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  RegExp = 'RegExp',
  Null = 'Null',
  Undefined = 'Undefined',
  Symbol = 'Symbol',
  Object = 'Object',
  Array = 'Array',
  process = 'process',
  Window = 'Window',
  Function = 'Function'
}

export const ERROR_TYPE_RE = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/
const globalVar = {
  isLogAddBreadcrumb: true,
  crossOriginThreshold: 1000
}

export const Silent = 'silent'
export { globalVar }