/**
 * @file 封装 log 对象
 * @class
 */

import ZPlainObj from './ZPlainObj'
import console from '../var/console'

const DEV = 'development'
const PRO = 'production'
const TEST = 'test'

export class Zlog extends ZPlainObj {

    constructor ( opt = { } ) {
        super( opt )
        this.env = opt.env || 'development'
        this.console = opt.console || console
        this.init()
    }

    init () {
        let key,
            target = {
            log ( ...rest ) {
                this.console.log( ...rest )
            },

            error ( ...rest ) {
                this.console.error( `>>>`, ...rest )
            },

            succee ( ...rest ) {
                this.green( `>>>`, ...rest )
            },

            green ( ...rest ) {
                this.console.log( `%c${rest.reduce( ( pre, cur ) => pre + ' ' + cur )}`, 'color: green' )
            },

            red ( ...rest ) {
                this.console.log( `%c${rest.reduce( ( pre, cur ) => pre + ' ' + cur )}`, 'color: red' )
            },
        }

        for ( key in target ) {
            this[ key ] = function ( ...rest ) {
                if ( this.env !== PRO ) {
                    target[ key ].apply( this, rest )
                }
            }
        }
    }
}

export default new Zlog( { _des: 'custom console obj.' } )
