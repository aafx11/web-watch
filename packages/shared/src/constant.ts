import { BrowserBreadcrumbTypes } from "./browser";
import { WxBreadcrumbTypes } from "./wx";


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