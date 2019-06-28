/**
 * @file create plain obj.
 * @class
 */
import z from '../'

const _params = Symbol( '_params' )

export default class ZPlainObj {
    constructor ( ...rest ) {
        let opt = rest[ 0 ] || { }
        if ( '_des' in opt ) {
            this._des = opt._des || ''
        }
        this[ _params ] = z.extend( true, { }, rest )
    }

    /**
     * 返回创建实例的参数
     */
    get _params () {
        return z.extend( true, { }, this[ _params ] )
    }
}
