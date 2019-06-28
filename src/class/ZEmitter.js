/**
 * @file 触发器
 * @class
 * @description 发布订阅模式
 */

import ZPlainObj from './ZPlainObj'
import z from '../../dist/index.aio'

export default class ZEmitter extends ZPlainObj {

    constructor ( opt = {} ) {
        super( opt )

        // Callbacks 的配置
        if ( 'config' in opt && z.isPlainObject( opt.config ) ) {
            this.config = opt.config
        }

        Object.assign( this, {
            _callbacks: {},
        } )
    }

    static Callbacks = z.Callbacks

    /**
     * 注册事件
     * @param { String } type 事件类型
     * @param { ...Function } fn 事件回调
     */
    on ( type, ...fn ) {
        if ( this._callbacks[ type ] == null ) {
            this._callbacks[ type ] = z.Callbacks( this.config )
        }
        this._callbacks[ type ].add( ...fn )
        return this
    }

    /**
     * 注销事件
     * @param { String } type 事件类型
     * @param { ...Function } fn 主要注销的事件地址
     */
    off ( type, ...fn ) {
        if ( this._callbacks[ type ] == null ) {
            return null
        }

        return this._callbacks[ type ].remove( ...fn )
    }

    /**
     * 触发事件
     * @param { Event } event 事件对象
     */
    trigger ( event ) {
        if ( typeof event !== 'object' ) {
            throw new Error( `<<< event is object.` )
        }

        if ( this._callbacks[ event.type ] == null ) {
            return null
        }

        try {
            this._callbacks[ event.type ].fire( event )
        } catch ( error ) {
            console.error( `<<< Catch event error: ${event.type}, ${error}` )
        }

        return this
    }
}
