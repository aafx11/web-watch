// import { setFlag, _support } from './global';
// import { EVENTTYPES } from '@web-watch/common';

import { BREADCRUMBCATEGORYS, BrowserBreadcrumbTypes, ErrorTypes } from '@web-watch/shared';
import { getTimestamp, getUrlWithEnv } from './helpers';
import { Severity } from './Severity';

/**
 * 返回包含id、class、innerTextde字符串的标签
 * @param target html节点
 */
export function htmlElementAsString(target: HTMLElement): string | null {
  const tagName = target.tagName.toLowerCase();
  if (tagName === 'body') {
    return null;
  }
  let classNames = target.classList.value;
  classNames = classNames !== '' ? ` class="${classNames}"` : '';
  const id = target.id ? ` id="${target.id}"` : '';
  const innerText = target.innerText;
  return `<${tagName}${id}${classNames !== '' ? classNames : ''}>${innerText}</${tagName}>`;
}

/**
 * 将地址字符串转换成对象
 * @returns 返回一个对象
 */
export function parseUrlToObj(url: string): {
  host?: string;
  path?: string;
  protocol?: string;
  relative?: string;
} {
  if (!url) {
    return {};
  }

  // eslint-disable-next-line no-useless-escape
  const match = url.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);

  if (!match) {
    return {};
  }

  const query = match[6] || '';
  const fragment = match[8] || '';
  return {
    host: match[4],
    path: match[5],
    protocol: match[2],
    relative: match[5] + query + fragment // everything minus origin
  };
}

/**
 * 根据browser行为类型返回种类
 *
 * @export
 * @param {BrowserBreadcrumbTypes} type
 * @return {*}  {BREADCRUMBCATEGORYS}
 */
export function getBreadcrumbCategoryInBrowser(type: BrowserBreadcrumbTypes): BREADCRUMBCATEGORYS {
  switch (type) {
    case BrowserBreadcrumbTypes.XHR:
    case BrowserBreadcrumbTypes.FETCH:
      return BREADCRUMBCATEGORYS.HTTP;
    case BrowserBreadcrumbTypes.CLICK:
    case BrowserBreadcrumbTypes.ROUTE:
      return BREADCRUMBCATEGORYS.USER;
    case BrowserBreadcrumbTypes.CUSTOMER:
    case BrowserBreadcrumbTypes.CONSOLE:
      return BREADCRUMBCATEGORYS.DEBUG;
    case BrowserBreadcrumbTypes.UNHANDLEDREJECTION:
    case BrowserBreadcrumbTypes.CODE_ERROR:
    case BrowserBreadcrumbTypes.RESOURCE:
    default:
      return BREADCRUMBCATEGORYS.EXCEPTION;
  }
}

/**
 * 解析error的stack，并返回args、column、line、func、url:
 * wx AppOnError use too
 * @param ex
 * @param level
 */
export function extractErrorStack(ex: any, level: Severity) {
  const normal = {
    time: getTimestamp(),
    url: getUrlWithEnv(),
    name: ex.name,
    level,
    message: ex.message
  };
  if (typeof ex.stack === 'undefined' || !ex.stack) {
    return normal;
  }

  const chrome =
    /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|[a-z]:|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
    gecko =
      /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i,
    winjs = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
    // Used to additionally parse URL/line/column from eval frames
    geckoEval = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
    chromeEval = /\((\S*)(?::(\d+))(?::(\d+))\)/,
    lines = ex.stack.split('\n'),
    stack = [];

  let submatch, parts, element;
  // reference = /^(.*) is undefined$/.exec(ex.message)

  for (let i = 0, j = lines.length; i < j; ++i) {
    if ((parts = chrome.exec(lines[i]))) {
      const isNative = parts[2] && parts[2].indexOf('native') === 0; // start of line
      const isEval = parts[2] && parts[2].indexOf('eval') === 0; // start of line
      if (isEval && (submatch = chromeEval.exec(parts[2]))) {
        // throw out eval line/column and use top-most line/column number
        parts[2] = submatch[1]; // url
        parts[3] = submatch[2]; // line
        parts[4] = submatch[3]; // column
      }
      element = {
        url: !isNative ? parts[2] : null,
        func: parts[1] || ErrorTypes.UNKNOWN_FUNCTION,
        args: isNative ? [parts[2]] : [],
        line: parts[3] ? +parts[3] : null,
        column: parts[4] ? +parts[4] : null
      };
    } else if ((parts = winjs.exec(lines[i]))) {
      element = {
        url: parts[2],
        func: parts[1] || ErrorTypes.UNKNOWN_FUNCTION,
        args: [],
        line: +parts[3],
        column: parts[4] ? +parts[4] : null
      };
    } else if ((parts = gecko.exec(lines[i]))) {
      const isEval = parts[3] && parts[3].indexOf(' > eval') > -1;
      if (isEval && (submatch = geckoEval.exec(parts[3]))) {
        // throw out eval line/coluqqqqqqqqqqqqqqqqqqqqqqqqqqqqmn and use top-most line number
        parts[3] = submatch[1];
        parts[4] = submatch[2];
        parts[5] = null; // no column when eval
      } else if (i === 0 && !parts[5] && typeof ex.columnNumber !== 'undefined') {
        // FireFox uses this awesome columnNumber property for its top frame
        // Also note, Firefox's column number is 0-based and everything else expects 1-based,
        // so adding 1
        // NOTE: this hack doesn't work if top-most frame is eval
        stack[0].column = ex.columnNumber + 1;
      }
      element = {
        url: parts[3],
        func: parts[1] || ErrorTypes.UNKNOWN_FUNCTION,
        args: parts[2] ? parts[2].split(',') : [],
        line: parts[4] ? +parts[4] : null,
        column: parts[5] ? +parts[5] : null
      };
    } else {
      continue;
    }

    if (!element.func && element.line) {
      element.func = ErrorTypes.UNKNOWN_FUNCTION;
    }

    stack.push(element);
  }

  if (!stack.length) {
    return null;
  }
  return {
    ...normal,
    stack: stack
  };
}


// /**
//  * 返回包含id、class、innerTextde字符串的标签
//  * @param target html节点
//  */
// export function htmlElementAsString(target: HTMLElement): string {
//   const tagName = target.tagName.toLowerCase();
//   if (tagName === 'body') {
//     return '';
//   }
//   let classNames = target.classList.value;

//   classNames = classNames !== '' ? ` class='${classNames}'` : '';
//   const id = target.id ? ` id="${target.id}"` : '';
//   const innerText = target.innerText;
//   return `<${tagName}${id}${classNames !== '' ? classNames : ''}>${innerText}</${tagName}>`;
// }

// /**
//  * 将地址字符串转换成对象，
//  * 输入：'https://github.com/xy-sea/web-see?token=123&name=11'
//  * 输出：{
//  *  "host": "github.com",
//  *  "path": "/xy-sea/web-see",
//  *  "protocol": "https",
//  *  "relative": "/xy-sea/web-see?token=123&name=11"
//  * }
//  */
// export function parseUrlToObj(url: string) {
//   if (!url) {
//     return {};
//   }
//   const match = url.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
//   if (!match) {
//     return {};
//   }
//   const query = match[6] || '';
//   const fragment = match[8] || '';
//   return {
//     host: match[4],
//     path: match[5],
//     protocol: match[2],
//     relative: match[5] + query + fragment,
//   };
// }

// // 设置默认配置
// export function setSilentFlag({
//   silentXhr = true,
//   silentFetch = true,
//   silentClick = true,
//   silentHistory = true,
//   silentError = true,
//   silentHashchange = true,
//   silentUnhandledrejection = true,
//   // silentWhiteScreen = false,
// }): void {
//   setFlag(EVENTTYPES.XHR, !silentXhr);
//   setFlag(EVENTTYPES.FETCH, !silentFetch);
//   setFlag(EVENTTYPES.CLICK, !silentClick);
//   setFlag(EVENTTYPES.HISTORY, !silentHistory);
//   setFlag(EVENTTYPES.ERROR, !silentError);
//   setFlag(EVENTTYPES.HASHCHANGE, !silentHashchange);
//   setFlag(EVENTTYPES.UNHANDLEDREJECTION, !silentUnhandledrejection);
//   // setFlag(EVENTTYPES.WHITESCREEN, !silentWhiteScreen);
// }

// // 对每一个错误详情，生成唯一的编码
// export function getErrorUid(input: string): string {
//   return window.btoa(encodeURIComponent(input));
// }


// export function hashMapExist(hash: string): boolean {
//   const exist = _support.errorMap.has(hash);
//   if (!exist) {
//     _support.errorMap.set(hash, true);
//   }
//   return exist;
// }
