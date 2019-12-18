/**
 * 获取 UUID
 */
export function getUUID () {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c ) {
        var r = ( d + Math.random() * 16 ) % 16 | 0
        d = Math.floor( d / 16 )
        return ( c === 'x' ? r : ( r & 0x3 | 0x8 ) ).toString( 16 )
    } )
    return uuid
}

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
 * 根据参数转成配置为 true 的选项
 * @param { Array | String } options 配置
 */
export function createOptions ( options ) {
    let object = {}
    if ( type( options ) === 'string' ) {
        options = options.split( /\s|\|/ )
    } else if ( type( options ) !== 'array' ) {
        return object
    }
    options.forEach( k => object[ k ] = true )
    return object;
}

/**
 * 合并数组伪数组
 * @param { Array | likeArray } first
 * @param { Array | likeArray } second
 */
export function merge ( first, second ) {
    let len = +second.length,
        j = 0,
        i = first.length

    for ( ; j < len; j++ ) {
        first[ i++ ] = second[ j ]
    }

    first.length = i

    return first
}

/**
 * 暴露函数
 */
export default {
    install ( Vue ) {
        let $z = {
            getUUID, type, isPlainObject, extend, merge,
        }
        Vue.prototype.$z = $z

        if ( !( '$z' in window ) ) {
            window.$z = $z
        }
    },
}
