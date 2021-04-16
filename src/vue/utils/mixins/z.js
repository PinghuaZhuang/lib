/**
 * @description 公用函数
 * @author pinghua.zhuang@luckincoffee.com
 */

/* eslint-disable */

import { INVALID_DATE, DATE_FORMAT } from './setting'
import moment from 'moment'
import currency from 'currency.js'

const rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g )

const types = 'Boolean Number String Function Array Date RegExp Object Error Symbol'
  .match( rnothtmlwhite )

export const class2type = {}

let i = 0, len = types.length, name

for ( ; i < len; i++ ) {
  name = types[ i ];
  class2type[ `[object ${name}]` ] = name.toLowerCase();
}

const { toString } = class2type

/**
 * 判断类型
 * @param { Any } obj
 * @return { String } 'boolean'|'number'...
 */
export function type ( obj ) {
  if ( obj == null ) {
    return obj + ''
  }

  // Support: Android <=2.3 only (functionish RegExp)
  return typeof obj === 'object' || typeof obj === 'function' ?
    class2type[ toString.call( obj ) ] || 'object' :
    typeof obj
}

const getProto = Object.getPrototypeOf
const hasOwn = class2type.hasOwnProperty
const fnToString = hasOwn.toString

/**
 * 是否为 plainObj
 * @param { Any } obj
 */
export function isPlainObject ( obj ) {
  var proto, Ctor;

  if ( !obj || toString.call( obj ) !== '[object Object]' ) {
    return false;
  }

  proto = getProto( obj );

  if ( !proto ) {
    return true;
  }

  Ctor = hasOwn.call( proto, 'constructor' ) && proto.constructor;
  return typeof Ctor === 'function' && fnToString.call( Ctor ) === fnToString.call( Object );
}

/**
 * 深浅拷贝
 * @param [ isDeep( Boolean ) ], target( Object ), Source( Object )
 * @return { Object } target
 */
export function extend () {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	if ( typeof target === 'boolean' ) {
		deep = target;

		target = arguments[ i ] || {}
		i++;
	}

	if ( typeof target !== 'object' && typeof target !== 'function' ) {
		target = {};
	}

	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		if ( ( options = arguments[ i ] ) != null ) {

			for ( name in options ) {
				copy = options[ name ]

				if ( name === '__proto__' || target === copy ) {
					continue;
				}

				if ( deep && copy && ( isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = []
					} else if ( !copyIsArray && !isPlainObject( src ) ) {
						clone = {}
					} else {
						clone = src
					}
					copyIsArray = false

					target[ name ] = extend( deep, clone, copy )

				} else if ( copy !== undefined ) {
					target[ name ] = copy
				}
			}
		}
	}

	return target
}
/**
 * 获取 UUID
 */
export function getUUID () {
  var d = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c ) {
    var r = ( d + Math.random() * 16 ) % 16 | 0
    d = Math.floor( d / 16 )
    return ( c === 'x' ? r : ( r & 0x3 | 0x8) ).toString( 16 )
  } )
  return uuid
}

/**
 * 判断运行环境
 * @return { String } 'test'|'test02'|'test03'|'pre'|'local'|'prod'
 */
export function getEnv () {
  return process.env.VUE_APP_NODE_ENV.toLowerCase()
}

/**
 * Buffer 转 base64
 * @param { Buffer } buffer
 */
export function transformArrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  for (var len = bytes.byteLength, i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * 根据 buffer 获取 xlsx-base64 地址
 * @param { Buffer } buffer
 */
export function getXlsxBase64(buffer) {
  return `data:application/vnd.ms-excel;base64,${transformArrayBufferToBase64(buffer)}`
}

/**
 * 根据 buffer 获取 pdf-base64 地址
 * @param { Buffer } buffer
 */
export function getPdfBase64(buffer) {
  return `data:application/pdf;base64,${transformArrayBufferToBase64(buffer)}`
}

/**
 * base64 编码转成 Blob
 * @param { Base64 } dataURI
 * @return { Blob }
 */
export function dataURIToBlob(dataURI) {
  let binStr = atob(dataURI.split(',')[1])
  let len = binStr.length
  let arr = new Uint8Array(len)

  for (let i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }

  return new Blob([arr])
}

/**
 * 金额计算
 */
const currencyDefOpt = { precision: 2, symbol: '' }
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
  turnCurrency(value, opt = {}) {
    opt = { ...currencyDefOpt, opt }
    return currency(value, opt).format()
  },
  /**
   * 转换为2位小数
   * @param { Number | String } value 金额
   * @param { Object } opt currency的配置
   */
  value(value, opt = {}) {
    opt = { ...currencyDefOpt, opt }
    return currency(value, opt).value
  },
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
 * 自定义下载
 * @param { String } href 下载地址
 * @param { String } name 下载重命名
 */
export function download ( href, name = `download.xlsx` ) {
  let eleLink = document.createElement( 'a' )
  eleLink.download = name
  eleLink.href = href
  eleLink.click()
  return eleLink
}

/**
 * 为 el-option 添加默认全部
 * @description 约定全部为空字符串
 * @param { Object } options 快速编码中修改类for of遍历器的对象
 * @return { Array<Object> } 返回 { label, value } 的对象数组
 */
export function turnOptionsDefAll(options) {
  if (options == null) {
    console.warn(`>>> z.turnOptionsDefAll params error:`, options)
    return []
  }
  const ret = [{
    label: '全部',
    value: '',
  }]
  for (const [v, k] of options) {
    ret.push({
      label: v, value: k,
    })
  }
  return ret
}

/**
 * 判断时间是否为空
 * @return { Boolean }
 */
export function isEmptyDate(date) {
  return date == null || date === '' || date === INVALID_DATE
}

/**
 * 拷贝文本到剪切板
 * @param { String } text 要拷贝的问题
 */
export function copyToClipboard(text) {
  if (text == null || text === '') return

  let textArea =  document.createElement('textarea')
  textArea.value = text
  textArea.focus()
  Object.assign(textArea.style, {
    position: 'fixed',
    top: '-10000px',
    left: '-10000px',
    'z-index': -1,
    width: '100px',
  })
  document.body.append(textArea)

  try {
    textArea.select()
    const ret = document.execCommand('copy')
    document.body.removeChild(textArea)
    if (!ret) {
      console.log(`>>> 拷贝文本未选中文本.`)
    }
  } catch (error) {
    console.error('<<< 改浏览器不支持 execCommand(\'copy\') 方法.')
  }
}

/**
 * 转换时间为目标格式
 * @param { String } date
 * @param { String } formatType
 * @return { String }
 */
export function turnTimeToString(date, formatType = DATE_FORMAT) {
  if (date == null || date === '') return ''

  const ret = moment(date).format(formatType)
  if (ret === INVALID_DATE) {
    console.warn(`>>> 日期格式不合法:`, date)
    return ''
  }
  return ret
}

/**
 * 创建时间范围
 * @description 一般用于最近三天的搜索条件, 基于moment
 * @param { Number } count 几天几月的数量, 默认值: 3
 * @param { String } type 天|月|年 默认: 'days'
 * @return { Array<Date> } el: [Date, Date]
 */
export function createTimeRange(count = 3, type = 'days') {
  const createTimeEnd = moment()
  const createTimeBegin = moment(createTimeEnd).subtract(count, type)
  return [createTimeBegin.toDate(), createTimeEnd.toDate()]
}

/**
 * 时间范围转换为对象
 * @param { Array } timeRange 时间范围
 * @param { string } timeKeys el: 'createTimeStart createTimeEnd'
 */
export function timeRange2Obj(timeRange, timeKeys = 'createTimeStart createTimeEnd') {
  const ret = {}
  timeKeys = timeKeys.split(' ').slice(0, 2)
  // 生成时间分成2个字段
  if (timeRange != null && timeRange.length >= 2) {
    timeKeys.forEach((k, i) => (ret[k] = turnTimeToString(timeRange[i])))
  }
  return ret
}

/**
 * 获取字符串长度. 单位px
 * @param { String } str 获取字符长度PX
 * @return { Number }
 */
export function getTextWidthPx(str, style = {}) {
  const elPx = document.createElement('div')
  Object.assign(elPx.style, {
    position: 'fixed',
    right: '-10000px',
    top: '-100px',
    'font-size': '14px',
    ...style,
  })
  elPx.innerText = str
  document.body.append(elPx)
  const width = elPx.getBoundingClientRect().width
  document.body.removeChild(elPx)
  return width
}

export default {
  install ( Vue ) {
    Vue.prototype.$z = {
      getUUID, extend, type, isPlainObject, getEnv, getTextWidthPx,
      download, transformArrayBufferToBase64, getXlsxBase64,
      getPdfBase64, turnOptionsDefAll, isEmptyDate, dataURIToBlob,
      copyToClipboard, turnTimeToString, createTimeRange, timeRange2Obj,
    }
  }
}
