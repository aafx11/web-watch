/**
 * 检查变量类型
 */
function isType(type: string) {
  return function (value: unknown): boolean {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
  };
}

export const variableTypeDetection = {
  isNumber: isType('Number'),
  isString: isType('String'),
  isBoolean: isType('Boolean'),
  isNull: isType('Null'),
  isUndefined: isType('Undefined'),
  isSymbol: isType('Symbol'),
  isFunction: isType('Function'),
  isObject: isType('Object'),
  isArray: isType('Array'),
  isProcess: isType('process'),
  isWindow: isType('Window'),
};

/**
 * 检查是否是错误类型
 */
export function isError(error: Error): boolean {
  switch (Object.prototype.toString.call(error)) {
    case '[object Error]':
      return true;
    case '[object Exception]':
      return true;
    case '[object DOMException]':
      return true;
    default:
      return false;
  }
}

/**
 * 检查是否是空对象,对象的key数量为0
 */
export function isEmptyObject(obj: object): boolean {
  return variableTypeDetection.isObject(obj) && Object.keys(obj).length === 0;
}

/**
 * 检查是否为空字符串或 undefined或 null
 */
export function isEmpty(wat: any): boolean {
  return (
    (variableTypeDetection.isString(wat) && wat.trim() === '') || wat === undefined || wat === null
  );
}

/**
 * 检查对象上是否有该属性
 */
export function isExistProperty(obj: any, key: any): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export const nativeToString = Object.prototype.toString;