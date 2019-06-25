// import { type } from '@jsmini/type';
import class2type from './class2type';
import toString from './toString';

export default function ( obj ) {
    if ( obj == null ) {
        return obj + '';
    }

    // Support: Android <=2.3 only (functionish RegExp)
    return typeof obj === 'object' || typeof obj === 'function' ?
        class2type[ toString.call( obj ) ] || 'object' :
        typeof obj;
};
