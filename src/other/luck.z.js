/**
 * @description 公用函数
 * @author pinghua.zhuang@luckincoffee.com
 */

import currency from 'currency.js'

const rnothtmlwhite = (/[^\x20\t\r\n\f]+/g)

const types = 'Boolean Number String Function Array Date RegExp Object Error Symbol'
  .match(rnothtmlwhite)

export const class2type = {}

let i = 0
let name
const len = types.length

for (; i < len; i++) {
  name = types[i]
  class2type[`[object ${name}]`] = name.toLowerCase()
}

const { toString } = class2type

/**
 * 判断类型
 * @param { Any } obj
 * @return { String } 'boolean'|'number'...
 */
export function type(obj) {
  if (obj == null) {
    return obj + ''
  }

  // Support: Android <=2.3 only (functionish RegExp)
  return typeof obj === 'object' || typeof obj === 'function'
    ? class2type[toString.call(obj)] || 'object' : typeof obj
}

const getProto = Object.getPrototypeOf
const hasOwn = class2type.hasOwnProperty
const fnToString = hasOwn.toString

/**
 * 是否为 plainObj
 * @param { Any } obj
 */
export function isPlainObject(obj) {
  var proto, Ctor;

  if (!obj || toString.call(obj) !== '[object Object]') {
    return false
  }

  proto = getProto(obj)

  if (!proto) {
    return true
  }

  Ctor = hasOwn.call(proto, 'constructor') && proto.constructor
  return typeof Ctor === 'function' && fnToString.call(Ctor) === fnToString.call(Object)
}

/**
 * 深浅拷贝
 * @param [ isDeep( Boolean ) ], target( Object ), Source( Object )
 * @return { Object } target
 */
export function extend() {
  let options
  let name
  let src
  let copy
  let copyIsArray
  let clone
  let target = arguments[0] || {}
  let i = 1
  let deep = false

  const length = arguments.length

  if (typeof target === 'boolean') {
    deep = target

    target = arguments[i] || {}
    i++
  }

  if (typeof target !== 'object' && typeof target !== 'function') {
    target = {}
  }

  if (i === length) {
    target = this
    i--
  }

  for (; i < length; i++) {
    if ((options = arguments[i]) != null) {
      for (name in options) {
        copy = options[name]

        if (name === '__proto__' || target === copy) {
          continue
        }

        if (deep && copy && (isPlainObject(copy) ||
					(copyIsArray = Array.isArray(copy)))) {
          src = target[name]

          if (copyIsArray && !Array.isArray(src)) {
            clone = []
          } else if (!copyIsArray && !isPlainObject(src)) {
            clone = {}
          } else {
            clone = src
          }
          copyIsArray = false

          target[name] = extend(deep, clone, copy)
        } else if (copy !== undefined) {
          target[name] = copy
        }
      }
    }
  }

  return target
}

/**
 * 获取 UUID
 */
export function getUUID() {
  var d = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

/**
 * 判断运行环境
 * @return { String } 'test'|'test02'|'pre'|'local'|production
 */
const TEST = 'test'
const TEST02 = 'test02'
const PRE = 'pre'
const LOCAL = 'local'
const PRODUCTION = 'production'
const DOMAIN = '.luckincoffee.com'
export function getEnv() {
  const newWindowHref = window.location.href.split(DOMAIN)[0].split('//')[1]
  const keys = [TEST, TEST02, PRE]
  let _env = PRODUCTION

  keys.forEach((k, index) => {
    if (new RegExp(`.+${k}$`).test(newWindowHref)) {
      _env = keys[index]
      return _env
    }
  })

  if (/^localhost/.test(newWindowHref)) { // 本地调试默认测1
    _env = LOCAL
  }

  return _env
}

/**
 * 自定义下载
 * @description 跨域后重命名无效
 * @param { String } href 下载路径
 * @param { String } name 下载后重命名
 */
export function download(href, name = `download.xlsx`) {
  const eleLink = document.createElement('a')
  eleLink.download = name
  eleLink.href = href
  eleLink.click()
}

/**
 * 获取路由参数, query形式
 * @param { String } url 路由
 * @return { Object } 参数对象
 */
export const getQueryParams = function(url) {
  const ret = {}
  if (type(url) !== 'string' || url == null) {
    return ret
  }

  url = decodeURI(url)
  let params = url.split('?')
  let len = 0

  if (params.length > 1) {
    params = params[1].split('&')
    len = params.length
  } else { // 没有参数
    return ret
  }

  let item
  let i = 0
  for (; i < len; i++) {
    item = params[ i ].split('=')
    if (item.length > 1) {
      ret[item[0]] = item[1]
    } else {
      console.error(`<<< getQueryParams 参数可能有误:`, url, params[i])
      continue
    }
  }

  return ret
}

/**
 * 获取滚动条高度
 */
export function getScrollHeight() {
  var scroll_top = 0
  if (document.documentElement && document.documentElement.scrollTop) {
    scroll_top = document.documentElement.scrollTop;
  } else if (document.body) {
    scroll_top = document.body.scrollTop
  }
  return scroll_top
}

/**
 * 滚动讨目标元素
 * @param { Element } container 滚动的父元素
 * @param { Element } selected 目标元素
 */
export function scrollIntoView(container, selected) {
  // if (Vue.prototype.$isServer) return;
  if (!selected) {
    container.scrollTop = 0
    return
  }

  const offsetParents = []
  let pointer = selected.offsetParent
  while (pointer && container !== pointer && container.contains(pointer)) {
    offsetParents.push(pointer)
    pointer = pointer.offsetParent
  }
  const top =
    selected.offsetTop +
    offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0)
  const bottom = top + selected.offsetHeight
  const viewRectTop = container.scrollTop
  const viewRectBottom = viewRectTop + container.clientHeight

  if (top < viewRectTop) {
    container.scrollTop = top
  } else if (bottom > viewRectBottom) {
    container.scrollTop = bottom - container.clientHeight
  }
}

/**
 * 转换为驼峰命名
 * @description 没有分割符直接返回
 * @param { String } key 源字符串
 * @param { String } dec 分割符, 默认'_'
 * @return { String }
 */
export const toCamelCase = function(key, dec = '_') {
  if (typeof dec !== 'string') return key
  if (dec === '') return key

  let ret = ''
  key.split(dec).forEach((_k, i) => {
    if (i > 0) {
      ret += _k[0].toUpperCase() + _k.slice(1)
    } else {
      ret += _k
    }
  })
  return ret
}

/**
 * 金额计算
 */
export const CurrencyCalc = {
  /**
   * 加减乘除
   * @param { Number | String } a 金额
   * @param { Number | String } b 金额或者被除数,乘数
   * @param { Number } precision 精度, 默认4位小数
   * @return { String } 金额转成字符串, 不是格式化后的
   */
  /* 加法 */
  add(a, b, precision = 4) {
    return '' + currency(a, { precision }).add(b).value
  },
  /* 减法 */
  sub(a, b, precision = 4) {
    return '' + currency(a, { precision }).subtract(b).value
  },
  /* 乘法 */
  multipy(a, b, precision = 4) {
    return '' + currency(a, { precision }).multiply(b).value
  },
  /* 除法 */
  distribute(a, b, precision = 4) {
    return '' + currency(
      currency(a, { precision }).intValue / b / Math.pow(10, precision),
      { precision }
    ).value
  },
  /**
   * 转换为2位小数
   * @param { Number | String } value 金额
   * @param { Object } opt currency的配置
   */
  turnCurrency(value, opt = { precision: 2, symbol: '' }) {
    return currency(value, opt).format()
  },
}

export default {
  install(Vue) {
    Vue.prototype.$z = {
      getUUID, extend, type, isPlainObject, getEnv,
      download, getScrollHeight, scrollIntoView,
      getQueryParams, CurrencyCalc, toCamelCase,
    }
  }
}
