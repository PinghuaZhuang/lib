import is from './is';
import type from './var/toType';
import indexOf from './var/indexOf';
// import concat from './var/concat';
import rnothtmlwhite from './var/rnothtmlwhite';

// trim 中使用
// let rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// 创建缓存的长度
const CACHELENGTH = 50;

let z = {
    version: VERSION
};

z.extend = ( ...args ) => {
    let options, name, src, copy, copyIsArray, clone,
        target = args[ 0 ] || {},
        i = 1,
        length = args.length,
        deep = false;

    // Handle a deep copy situation
    if ( type( target ) === 'boolean' ) {
        deep = target;

        // Skip the boolean and the target
        target = args[ i ] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( type( target ) !== 'object' && !is.isFunction( target ) ) {
        target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if ( i === length ) {
        target = z;
        i--;
    }

    for ( ; i < length; i++ ) {

        // Only deal with non-null/undefined values
        if ( ( options = args[ i ] ) != null ) {

            // Extend the base object
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];

                // Prevent never-ending loop
                if ( target === copy ) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if ( deep && copy && ( is.isPlainObject( copy ) ||
					( copyIsArray = is.isArray( copy ) ) ) ) {

                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && is.isArray( src ) ? src : [];

                    } else {
                        clone = src && is.isPlainObject( src ) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[ name ] = z.extend( deep, clone, copy );

                    // Don't bring in undefined values
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }
    return target;
};

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
