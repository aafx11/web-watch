import { ToStringTypes } from '@web-watch/shared';
import { logger, getTimestamp, silentConsoleScope, toStringValidateOption } from '@web-watch/utils';
import { BaseOptionsFieldsIntegrationType, BreadcrumbPushData } from '@web-watch/types';

/**
 * 用户行为栈存储，实体类
 *
 * @export
 * @class Breadcrumb
 * @template O
 */
export class Breadcrumb<O extends BaseOptionsFieldsIntegrationType = BaseOptionsFieldsIntegrationType> {
  private maxBreadcrumbs = 10;
  private beforePushBreadcrumb: unknown = null;
  private stack: BreadcrumbPushData[] = [];
  constructor(options: Partial<O> = {}) {
    this.bindOptions(options);
  }

  // 添加用户行为栈
  push(data: BreadcrumbPushData): BreadcrumbPushData[] {
    if (typeof this.beforePushBreadcrumb === 'function') {
      let result: BreadcrumbPushData | null = null;
      const beforePushBreadcrumb = this.beforePushBreadcrumb;
      silentConsoleScope(() => {
        result = beforePushBreadcrumb.call(this, this, data);
      });
      if (!result) return this.stack;
      return this.immediatePush(result);
    }
    return this.immediatePush(data);
  }

  private immediatePush(data: BreadcrumbPushData): BreadcrumbPushData[] {
    data.time || (data.time = getTimestamp());
    if (this.stack.length >= this.maxBreadcrumbs) {
      this.shift();
    }
    this.stack.push(data);
    // @ts-ignore
    this.stack.sort((a: BreadcrumbPushData, b: BreadcrumbPushData) => a.time - b.time);
    logger.log(this.stack);
    return this.stack;
  }

  private shift(): boolean {
    return this.stack.shift() !== undefined;
  }

  clear(): void {
    this.stack = [];
  }

  getStack(): BreadcrumbPushData[] {
    return this.stack;
  }

  // 赋值用户行为栈最大数量和push前钩子函数
  bindOptions(options: Partial<O> = {}): void {
    const { maxBreadcrumbs, beforePushBreadcrumb } = options;
    toStringValidateOption(maxBreadcrumbs, 'maxBreadcrumbs', ToStringTypes.Number) && (this.maxBreadcrumbs = maxBreadcrumbs!);
    toStringValidateOption(beforePushBreadcrumb, 'beforePushBreadcrumb', ToStringTypes.Function) &&
      (this.beforePushBreadcrumb = beforePushBreadcrumb);
  }
}
