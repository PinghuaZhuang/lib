import Sensor from '../Sensor'
import {
    MoveRight, MoveLeft,
} from './moveEvent'

const onclick = Symbol( 'click' )

export default class Move extends Sensor {

    constructor ( container, option ) {
        super( container, option )

        this[ onclick ] = this[ onclick ].bind( this )
    }

    /**
     * 注册
     */
    attach() {
        this._attach()

        window.addEventListener( 'click', this[ onclick ] )

        return this
    }

    /**
     * 删除
     */
    detach() {
        this._detach()

        window.removeEventListener( 'click', this[ onclick ] )

        return this
    }

    [ onclick ] ( event ) {
        this.trigger( this.container[ 0 ], new MoveLeft( {
            _des: 'coustom-event-test.',
            event
        } ) )
    }
}
