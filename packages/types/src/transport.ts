import { ErrorTypes } from '@web-watch/shared';
import { BreadcrumbPushData } from './breadcrumb';
import { HttpTransformedType } from './http';
import { DeviceInfo } from './wx';

// 基础上报数据
export interface BaseTransformType {
  type?: ErrorTypes;
  message?: string;
  time?: number;
  name?: string;
  level?: string;
  url: string;
}

// SDK版本信息、apikey、trackerId
export interface AuthInfo {
  apikey?: string;
  sdkVersion: string;
  sdkName: string;
  trackerId?: string;
}

// 上报的完整数据
export interface TransportDataType {
  authInfo?: AuthInfo;
  breadcrumb?: BreadcrumbPushData[];
  data?: ReportDataType;
  record?: any[];
  deviceInfo?: DeviceInfo;
}

// 上报的数据
export interface ReportDataType extends Partial<HttpTransformedType> {
  stack?: any;
  errorId?: number;
  // vue组件名
  componentName?: string;
  propsData?: any;
  // logError 手动报错
  customTag?: string;
}

