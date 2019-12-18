/**
 * 控制台打印
 */

import z from '../utils/z'

const CACHELENGTH = 50

let types = 'error warn info'

class ZLogger {
    static console = window.console

    constructor () {}

    static group () {}

    static createCache ( cacheLength = CACHELENGTH ) {
        let keys = [], seed = 0

        function cache ( key, value ) {
            seed ++
            let _k = `_${seed}_` + key
            if ( keys.push( _k ) > cacheLength ) {
                delete cache[ keys.shift() ]
            }
            return value == null ? cache[ _k ] : ( cache[ _k ] = value )
        }
        return cache;
    }
}
