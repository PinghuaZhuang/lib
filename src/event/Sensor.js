// import Emitter from './Emitter'
import z from '../../dist/index.aio'

export default class Sensor {
    static type = 'sensor'

    constructor ( container = [], option ) {
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
     * 触发
     */
    _attach () {
        return this
    }
    attach() {
        return this._attach()
    }

    /**
     * 注销事件
     */
    _detach () {
        return this
    }
    detach() {
        return this._detach()
    }

    on ( type, ...fn ) {
        this.$emitter.on( type, ...fn )
        return this
    }

    off ( type, ...fn ) {
        this.$emitter.off( type, ...fn )
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
