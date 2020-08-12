import { ID, PID, CHILD } from './var/treeKeys';

/**
 * 转换数据为对象
 * @param { String } res 转换设备上报的字符数据为对象
 */
export function parse(res) {
    let data;
    try {
        data = JSON.parse(res);
    } catch (err) {

        res = res.replace(/:"{/g, ':{');
        res = res.replace(/}",/g, '},');
        res = res.replace(/}"}/g, '}}');
        res = res.replace(/\\/g, '');
        try {
            data = JSON.parse(res);
        } catch (error) {
            console.error('RES 数据解析失败：' + error.message);
        }
    }
    return data;
}

/**
 * 转换数据为树形状结构
 * @param { Array } arr 目标数组
 * @param { Object } keys { id, pid, child }
 */
export function toTree(arr, keys) {
    let idMap = {};         // 映射 id
    let res = [];           // 最终返回的树形结构数据

    let id = keys.id || ID;
    let pid = keys.pid || PID;
    let child = keys.child = CHILD;

    // 使用 ID 作为 key 将数组转换为对象
    arr.forEach(function (el) {
        idMap[el[id]] = el;
    });

    // 遍历, 判断元素是否有父节点
    arr.forEach(function (el) {
        let parent = idMap[el[pid]];

        if (parent) {
            if (!parent[child]) {
                parent[child] = [];
            }
            parent[child].push(el);
        } else {

            // 没有父元素
            res.push(el);
        }
    });

    return res;
}

/**
 * 转换数组对象为keymap对象
 * @param { Array } arr 目标数据
 * @param { String } key 映射的键
 * @return { Object }
 */
export function toKeyMapObj(arr, key = 'id') {
    const ret = {}
    arr.forEach(o => (ret[o.id] = o))
    return ret
}

/**
 * Buffer 转 base64
 * @param { Buffer } buffer
 */
export function transformArrayBufferToBase64(buffer) {
    let binary = '', i = 0
    let bytes = new Uint8Array(buffer)
    let len = bytes.byteLength
    for (; i < len; i++) {
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
