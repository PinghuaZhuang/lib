import is from './is';
import type from './var/toType';
import indexOf from './var/indexOf';
// import concat from './var/concat';
import rnothtmlwhite from './var/rnothtmlwhite';
import { extend } from './utils/extend'

// trim 中使用
// let rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// 创建缓存的长度
const CACHELENGTH = 50;

let z = {
    version: 'VERSION'
};

z.extend = extend;

// 类型判断
z.extend( is );

z.extend( {
    type,

    each ( obj, callback ) {
        let length, i = 0;

        if ( z.isArrayLike( obj ) ) {
            length = obj.length;
            for ( ; i < length; i++ ) {
                if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                    break;
                }
            }
        } else {
            for ( i in obj ) {
                if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                    break;
                }
            }
        }

        return obj;
    },

    // trim ( text ) {
    //     return text == null ?
    //         '' :
    //         ( text + '' ).replace( rtrim, '' );
    // },

    inArray ( elem, arr, i ) {
        return arr == null ? -1 : indexOf.call( arr, elem, i );
    },

    merge ( first, second ) {
        let len = +second.length,
            j = 0,
            i = first.length;

        for ( ; j < len; j++ ) {
            first[ i++ ] = second[ j ];
        }

        first.length = i;

        return first;
    },

    // grep ( elems, callback, invert ) {
    //     let callbackInverse,
    //         matches = [],
    //         i = 0,
    //         length = elems.length,
    //         callbackExpect = !invert;

    //     // Go through the array, only saving the items
    //     // that pass the validator function
    //     for ( ; i < length; i++ ) {
    //         callbackInverse = !callback( elems[ i ], i );
    //         if ( callbackInverse !== callbackExpect ) {
    //             matches.push( elems[ i ] );
    //         }
    //     }

    //     return matches;
    // },

    // // arg is for internal usage only
    // map ( elems, callback, arg ) {
    //     let length, value,
    //         i = 0,
    //         ret = [];

    //     // Go through the array, translating each of the items to their new values
    //     if ( z.isArrayLike( elems ) ) {
    //         length = elems.length;
    //         for ( ; i < length; i++ ) {
    //             value = callback( elems[ i ], i, arg );

    //             if ( value != null ) {
    //                 ret.push( value );
    //             }
    //         }

    //         // Go through every key on the object,
    //     } else {
    //         for ( i in elems ) {
    //             value = callback( elems[ i ], i, arg );

    //             if ( value != null ) {
    //                 ret.push( value );
    //             }
    //         }
    //     }

    //     // Flatten any nested arrays
    //     return concat.apply( [], ret );
    // },

    createOptions ( options ) {
        let object = {};
        z.each( options.match( rnothtmlwhite ) || [], function ( _, flag ) {
            object[ flag ] = true;
        } );
        return object;
    },

    createCache ( length ) {
        let keys = [];
        let cacheLength = length || CACHELENGTH;

        function cache ( key, value ) {
            if ( keys.push( key + ' ' ) > cacheLength ) {

                // Only keep the most recent entries
                delete cache[ keys.shift() ];
            }
            return value == null ? cache[ key + ' ' ] : ( cache[ key + ' ' ] = value );
        }
        return cache;
    }
} );



export default z;
