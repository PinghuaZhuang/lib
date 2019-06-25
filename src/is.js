import type from './var/toType';
import getProto from './var/getProto';
import hasOwn from './var/hasOwn';
import fnToString from './var/fnToString';


export function isInRange ( x, min, max ) {
    x = +x;
    min = +min;
    max = +max;

    // x 不是数字，则返回false
    if ( isNaN( x ) ) {
        return false;
    }

    // min 或 max 不传，则认为不设置下限或上限
    return ( !isNaN( min ) ? x >= min : true ) && ( !isNaN( max ) ? x <= max : true );
}

// 不包含 NaN
export function isNumber ( x ) {
    return type( x ) === 'number' && !isNaN( x );
}

// export function isInteger ( x, min, max ) {
//     return parseInt( x, 10 ) === x && isInRange( x, min, max );
// }

// export function isInt ( x ) {

//     // -2^31 ~ 2^31-1
//     return isInteger( x, -2147483648, 2147483647 );
// }

export function isBoolean ( x ) {
    return type( x ) === 'boolean';
}

export function isString ( x ) {
    return type( x ) === 'string';
}

// 包含空格字符串: '   '
export function isEmptyString ( x ) {
    if ( !isString( x ) ) {
        return false;
    }

    return /^\s*$/.test( x );
}

export function isNull ( x ) {
    return type( x ) === 'null';
}

export function isUndefined ( x ) {
    return type( x ) === 'undefined';
}

export function isObject ( x ) {
    return type( x ) === 'object';
}

export function isFunction ( x ) {
    return type( x ) === 'function';
}

export function isPlainObject ( obj ) {
    var proto, Ctor;

    // Detect obvious negatives
    // Use toString instead of jQuery.type to catch host objects
    if ( !obj || toString.call( obj ) !== '[object Object]' ) {
        return false;
    }

    proto = getProto( obj );

    // Objects with no prototype (e.g., `Object.create( null )`) are plain
    if ( !proto ) {
        return true;
    }

    // Objects with prototype are plain iff they were constructed by a global Object function
    Ctor = hasOwn.call( proto, 'constructor' ) && proto.constructor;
    return typeof Ctor === 'function' && fnToString.call( Ctor ) === fnToString.call( Object );
}

export const isArray = isFunction( Array.isArray ) ? Array.isArray : function isArray ( x ) {
    return type( x ) === 'array';
};

export function isArrayLike ( obj ) {

    // Support: real iOS 8.2 only (not reproducible in simulator)
    // `in` check used to prevent JIT error (gh-2145)
    // hasOwn isn't used here due to false negatives
    // regarding Nodelist length in IE
    var length = !!obj && 'length' in obj && obj.length,
        objType = type( obj );

    if ( isFunction( obj ) || isWindow( obj ) ) {
        return false;
    }

    return objType === 'array' || length === 0 ||
		typeof length === 'number' && length > 0 && ( length - 1 ) in obj;
}

export function isWindow ( obj ) {
    return obj != null && obj === obj.window;
};

export function isEmptyObject ( obj ) {
    var name;

    for ( name in obj ) {
        return false;
    }
    return isObject( obj );
};

export default {
    isInRange,
    isNumber,

    // isInteger,
    // isInt,
    isBoolean,
    isString,
    isEmptyString,
    isNull,
    isUndefined,
    isObject,
    isFunction,
    isArray,
    isPlainObject,
    isArrayLike,
    isWindow,
    isEmptyObject
};
