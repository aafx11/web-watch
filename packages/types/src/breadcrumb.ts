import { BREADCRUMBCATEGORYS, BreadcrumbTypes } from '@web-watch/shared';
import { Severity } from '@web-watch/utils';
import { ConsoleCollectType, RouteChangeCollectType } from './basePluginType';
import { TNumStrObj } from './common';
import { ReportDataType } from './transport';

export interface BreadcrumbPushData {
  /**
   * 事件类型
   */
  type: BreadcrumbTypes;
  // string for click dom
  data: ReportDataType | RouteChangeCollectType | ConsoleCollectType | TNumStrObj;
  /**
   * 分为user action、debug、http、
   */
  category?: BREADCRUMBCATEGORYS;
  time?: number;
  level: Severity;
}
