// 等级程度枚举
export enum Severity {
  // 事件类型
  Else = 'else',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Debug = 'debug',
  // 上报的错误等级
  Low = 'low',
  Normal = 'normal',
  High = 'high',
  Critical = 'critical'
}


export namespace Severity {
  // 转换成对应的事件类型
  export function fromString(level: string): Severity {
    switch (level) {
      case 'debug':
        return Severity.Debug
      case 'info':
      case 'log':
      case 'assert':
        return Severity.Info
      case 'warn':
      case 'warning':
        return Severity.Warning
      case Severity.Low:
      case Severity.Normal:
      case Severity.High:
      case Severity.Critical:
      case 'error':
        return Severity.Error
      default:
        return Severity.Else
    }
  }
}
