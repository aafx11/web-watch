// 键为string，值为any的对象
export interface IAnyObject {
  [key: string]: any
}

// 数字/字符串/对象类型
export type TNumStrObj = number | string | object