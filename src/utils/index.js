/**
 * 获取 UUID
 */
export function getUUID () {
    let d = new Date().getTime()
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c ) {
        let r = ( d + Math.random() * 16 ) % 16 | 0
        d = Math.floor( d / 16 )
        return ( c === 'x' ? r : ( r & 0x3 | 0x8 ) ).toString( 16 )
    } )
    return uuid
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
    return eleLink
}
