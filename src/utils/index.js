/**
 * 获取 UUID
 */
export function getUUID() {
    let d = new Date().getTime();
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
    );
    return uuid;
}

/**
 * 转换为驼峰命名
 * @description 没有分割符直接返回
 * @param { String } key 源字符串
 * @param { String } dec 分割符, 默认'_'
 * @return { String }
 */
export const toCamelCase = function (key, dec = "_") {
    if (typeof dec !== "string") return key;
    if (dec === "") return key;

    let ret = "";
    key.split(dec).forEach((_k, i) => {
        if (i > 0) {
            ret += _k[0].toUpperCase() + _k.slice(1);
        } else {
            ret += _k;
        }
    });
    return ret;
};

/**
 * 获取路由参数, query形式
 * @param { String } url 路由
 * @return { Object } 参数对象
 */
export const getQueryParams = function (url) {
    const ret = {};
    if (type(url) !== "string" || url == null) {
        return ret;
    }

    url = decodeURI(url);
    let params = url.split("?");
    let len = 0;

    if (params.length > 1) {
        params = params[1].split("&");
        len = params.length;
    } else {
        // 没有参数
        return ret;
    }

    let item;
    let i = 0;
    for (; i < len; i++) {
        item = params[i].split("=");
        if (item.length > 1) {
            ret[item[0]] = item[1];
        } else {
            console.error(`<<< getQueryParams 参数可能有误:`, url, params[i]);
            continue;
        }
    }

    return ret;
};

/**
 * 自定义下载
 * @description 跨域后重命名无效
 * @param { String } href 下载路径
 * @param { String } name 下载后重命名
 */
export function download(href, name = `download.xlsx`) {
    const eleLink = document.createElement("a");
    eleLink.download = name;
    eleLink.href = href;
    eleLink.click();
    return eleLink;
}

/**
 * 拷贝文本到剪切板
 * @param { String } text 要拷贝的问题
 */
export function copyToClipboard(text) {
    if (text == null || text === "") return;

    let textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.focus();
    Object.assign(textArea.style, {
        position: "fixed",
        top: "-10000px",
        left: "-10000px",
        "z-index": -1,
        width: "100px",
    });
    document.body.append(textArea);

    try {
        textArea.select();
        const ret = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (!ret) {
            console.log(`>>> 拷贝文本未选中文本.`);
        }
    } catch (error) {
        console.error("<<< 改浏览器不支持 execCommand('copy') 方法.");
    }
}

/**
 * 转换时间为目标格式
 * @param { String } date
 * @param { String } formatType
 * @return { String }
 */
export function turnTimeToString(date, formatType = DATE_FORMAT) {
    if (date == null || date === "") return "";

    const ret = moment(date).format(formatType);
    if (ret === INVALID_DATE) {
        console.warn(`>>> 日期格式不合法:`, date);
        return "";
    }
    return ret;
}

/**
 * 创建缓存对象
 * @param { Number } length
 */
export function createCache(length) {
    const keys = [];
    let cacheLength = length || 50;

    function cache(key, value) {
        if (typeof key === "function") {
            const handler = key;
            return keys.map((k) => handler(k));
        }

        if (keys.push(key + " ") > cacheLength) {
            delete cache[keys.shift()];
        }
        return value == null ? cache[key + " "] : (cache[key + " "] = value);
    }
    return cache;
}

/**
 * 返回排序后的数据
 * @param {Array<any>} arr 原数组
 * @param {Number} index 当前索引
 * @param {Number} [translate] 上移或者下移格数, 大于0下移, 小与0上移
 */
export function translateArray(arr, index, translate = -1 /* 默认上移一格 */) {
    if (translate === 0) return arr;
    translate = translate > 0 ? translate + 1 : translate;
    const dup = [...arr];
    const target = dup.at(index);
    dup.splice(index + translate, 0, target);
    dup.splice(translate > 0 ? index : index + 1, 1);
    return dup;
}
