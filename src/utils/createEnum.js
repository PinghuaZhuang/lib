/**
 * 创建类似枚举型数据的对象
 * @param { String } keys
 * @returns { Object }
 * @example createEnum( 'Sun, Mon, Tue, Wed, Thu, Fri, Sat' );
 */
export function createEnum ( keys ) {
    keys = keys.split( /\s|\||,\s/ );

    var len = keys.length, i, key;

    var obj = {};

    for ( i = 0; i < len; i++ ) {
        key = keys[ i ];
        obj[ ( obj[ key ] = i ) ] = key;
    }

    return obj;
}
