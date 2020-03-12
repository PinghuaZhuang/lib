import { ID, PID, CHILD } from './var/treeKeys';

/**
 * 转换数据为对象
 * @param { String } res 转换设备上报的字符数据为对象
 */
export function parse ( res ) {
    let data;
    try {
        data = JSON.parse( res );
    } catch ( err ) {

        res = res.replace( /:"{/g, ':{' );
        res = res.replace( /}",/g, '},' );
        res = res.replace( /}"}/g, '}}' );
        res = res.replace( /\\/g, '' );
        try {
            data = JSON.parse( res );
        } catch ( error ) {
            console.error( 'RES 数据解析失败：' + error.message );
        }
    }
    return data;
}

/**
 * 转换数据为树行结构
 * @param { Array } arr 目标数组
 * @param { Object } keys { id, pid, child }
 */
export function toTree ( arr, keys ) {
    let idMap = {};         // 映射 id
    let res = [];           // 最终返回的树形结构数据

    let id = keys.id || ID;
    let pid = keys.pid || PID;
    let child = keys.child = CHILD;

    // 使用 ID 作为 key 将数组转换为对象
    arr.forEach( function ( el ) {
        idMap[ el [ id ] ] = el;
    } );

    // 遍历, 判断元素是否有父节点
    arr.forEach( function ( el ) {
        let parent = idMap[ el[ pid ] ];

        if ( parent ) {
            if ( !parent[ child ] ) {
                parent[ child ] = [];
            }
            parent[ child ].push( el );
        } else {

            // 没有父元素
            res.push( el );
        }
    } );

    return res;
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
