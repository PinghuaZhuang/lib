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

	// Handle a deep copy situation
	if ( typeof target === 'boolean' ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {}
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== 'object' && typeof target !== 'function' ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ]

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === '__proto__' || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = []
					} else if ( !copyIsArray && !isPlainObject( src ) ) {
						clone = {}
					} else {
						clone = src
					}
					copyIsArray = false

					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy )

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy
				}
			}
		}
	}

	// Return the modified object
	return target
}
