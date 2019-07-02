/**
 * @file 封装 log 对象
 * @export ZLog
 * @return Zlog 单一实例
 */

import ZPlainObj from './ZPlainObj'
import z from '..'

const console = window.console
const DEV = 'development'
const PRO = 'production'
const TEST = 'test'
const env = Symbol( 'env' )

/**
 * 获取带有颜色的打印参数
 * @param { String } color 颜色值
 */
function getRest ( color, ...rest ) {
    return this.console.log(
        `%c${rest.reduce( ( pre, cur ) => pre + ' ' + cur )}`,
        `color: ${color}`
    )
}

// 从 console 下拷贝的方法
let fns = 'log count assert table group groupEnd time timeEnd profile profileEnd'.split( ' ' )

let target = {

    error ( ...rest ) {
        this.console.error( `>>>`, ...rest )
    },

    succee ( ...rest ) {
        this.green( `>>>`, ...rest )
    },

    green ( ...rest ) {
        getRest.call( this, 'green', ...rest )
    },

    red ( ...rest ) {
        getRest.call( this, 'red', ...rest )
    },

    blue ( ...rest ) {
        getRest.call( this, 'blue', ...rest )
    },

    yellow ( ...rest ) {
        getRest.call( this, 'yellow', ...rest )
    }
}

// 拷贝方法
fns.forEach( ( key ) => {
    target[ key ] = function ( ...rest ) {
        this.console[ key ]( ...rest )
    }
} )

export class Zlog extends ZPlainObj {

    constructor ( opt = { } ) {
        super( opt )
        this[ env ] = opt.env && z.isString( opt.env ) || 'development'
        this.console = opt.console || console
        this.init()
    }

    init () {
        let key

        for ( key in target ) {
            this[ key ] = ( function ( key ) {
                return function ( ...rest ) {
                    if ( this[ env ] !== PRO ) {
                        target[ key ].apply( this, rest )
                    }
                }
            } )( key )
            this[ `_${key}` ] = target[ key ].bind( this )
        }
    }

    /**
     * 修改环境变量
     * @param { String | Boolean } str 可能值: development | production | test
     */
    env ( str ) {
        if (  z.isBoolean( str ) ) {
            // 为 true 是打印, false 为生产环境.
            str ? this[ env ] = true : this[ env ] = PRO
        } else if ( z.isString( str ) ) {
            this[ env ] = str
        }
        return this
    }
}

export default new Zlog( { _des: 'default zlog.' } )
