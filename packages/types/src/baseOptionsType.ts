import { VueInstance } from "./vue";
type CANCEL = null | undefined | boolean;

// 设置请求头函数
type TSetRequestHeader = (key: string, value: string) => {};
// 发送请求前的配置
export interface IBeforeAppAjaxSendConfig {
  setRequestHeader: TSetRequestHeader;
}

// 请求方式 
export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'OPTIONS';

// 请求头信息
interface IRequestHeaderConfig {
  url: HttpMethod;
  method: string;
}

// 基础配置项属性
export interface BaseOptionsFieldsType {
  /**
   * 上报到服务端的url
   */
  dsn?: string;
  /**
   * 禁用SDK
   */
  disabled?: boolean;
  /**
   * 表示每个项目的唯一值
   */
  apikey?: string;
  /**
   * 是否在控制台打印收集到的数据
   */
  debug?: boolean;
  /**
   * 是否为所有页面的http请求在请求头中添加唯一TraceId
   */
  enableTraceId?: boolean;
  /**
   * 当你设置enableTraceId:true，traceId将会在请求头中被添加，默认key是TraceId。你可以通过配置当前属性来指定名称
   */
  traceIdFieldName?: string;
  /**
   * 当你设置enableTraceId:true，includeHttpUrlTraceIdRegExp设置哪些url会被添加上TraceId
   */
  includeHttpUrlTraceIdRegExp?: RegExp;
  /**
   * url白名单，这些url将不会被监听
   */
  filterXhrUrlRegExp?: RegExp;
  /**
   * 最大用户行为栈的长度
   */
  maxBreadcrumbs?: number;
  /**
   * 表示收集按钮点击事件和微信小程序touch事件的节流时间
   */
  throttleDelayTime?: number;
  /**
   * 表示同一个错误上报的最大次数
   */
  maxDuplicateCount?: number;
  /**
   * Vue实例
   */
  vue?: VueInstance;
}

// 钩子函数
export interface BaseOptionsHooksType {

}