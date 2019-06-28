/**
 * @file 事件的抽象类
 * @class
 * @abstract
 */

// import ZPlainObj from '../class/ZPlainObj'

// const canceled = Symbol( 'canceled' )

export default class ZAbstractEvent /* extends ZPlainObj */ {

    static type = 'custom-event' // 事件类型

    constructor ( data = {} ) {
        if ( !( '_des' in data ) ) {
            this._des = this.type
        }
        this.data = data
    }

    /**
     * 获取事件类型
     */
    get type () {
        return this.constructor.type
    }
}
