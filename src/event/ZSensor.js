/**
 * @file 传感器
 * @class
 */

// import Emitter from './Emitter'
import ZPlainObj from '../class/ZPlainObj'
import z from '..'

export default class ZSensor extends ZPlainObj {
    static type = 'sensor'

    constructor ( container = [], option ) {
        super( option )
        if ( !z.isArray( container ) /* && z.isDom( container ) */ ) {
            container = [ container ]
        }
        this.container = [ ...container ]
        // this.option = { ...option }
        // this.$emitter = new Emitter()
    }

    /**
     * 返回事件类型
     * @return { String }
     */
    get type () {
        return this.constructor.type
    }

    /**
     * 创建触发条件
     */
    _attach () {
        return this
    }
    attach() {
        return this._attach()
    }

    /**
     * 解绑触发条件
     */
    _detach () {
        return this
    }
    detach() {
        return this._detach()
    }

    /**
     * 注册事件
     * @param { String } type 事件类型
     * @param  { Function } fn 回调函数, 参数: ZSensorEvent
     */
    on ( type, fn ) {
        // this.$emitter.on( type, ...fn )
        this.container.forEach( ( element ) => {
            element.addEventListener( type, fn )
        } )
        return this
    }

    /**
     * 注销事件
     * @param { String } type 事件类型
     * @param  { Function } fn 注册的事件
     */
    off ( type, fn ) {
        // this.$emitter.off( type, ...fn )
        this.container.forEach( ( element ) => {
            element.removeEventListener( type, fn )
        } )
        return this
    }

    /**
     * 触发事件
     * @param { Element } element 触发对象, DOM 元素
     * @param { SensorEvent } sensorEvent 事件对象
     */
    trigger ( element, sensorEvent, ...rest ) {

        if ( element == null || !element.dispatchEvent ) {
            // let event = element, param1 = sensorEvent
            // this.$emitter.trigger( event, param1, ...rest  )
            // console.error( `>>> ` )
            return
        }

        const event = document.createEvent( 'Event' )
        event.detail = sensorEvent
        event.initEvent( sensorEvent.type, true, true )
        element.dispatchEvent( event )
        // this.lastEvent = sensorEvent
        return this
    }
}
