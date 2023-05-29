import { Severity } from '@web-watch/utils'
import { HttpCollectedType } from './http'

// 键为string，值为any的对象
export interface IAnyObject {
  [key: string]: any
}

// 数字/字符串/对象类型
export type TNumStrObj = number | string | object

export type voidFun = () => void

// 资源加载错误
export interface ResourceErrorTarget {
  src?: string
  href?: string
  localName?: string
}

export interface webWatchXMLHttpRequest extends XMLHttpRequest {
  [key: string]: any
  httpCollect?: HttpCollectedType
}

export interface ErrorStack {
  args: any[]
  func: string
  column: number
  line: number
  url: string
}

export interface WxParsedErrorType {
  message: string
  name: string
  stack: ErrorStack[]
}

export interface LocalStorageValue<T = any> {
  expireTime?: number
  value: T | string
}

export interface LogTypes {
  message?: TNumStrObj
  tag?: TNumStrObj
  level?: Severity
  ex?: Error | any
}
