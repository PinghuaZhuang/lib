/**
 * @file create an obj.
 * @return Data 返回单一实例
 */

import z from '../core';
import rnothtmlwhite from '../var/rnothtmlwhite';
import concat from '../var/concat';

import slice from '../var/slice';

let _datas = [];

let fns = 'remove has empty disable disabled lock locked fireWith fire fired'
    .match( rnothtmlwhite );

let _old, _cur;

/**
 * 创建一个以数据驱动的对象, 当数据发生变化, 执行队列
 *
 * @param { String } name 数据名
 * @param { Object | String } options 配置信息
 * @example var height = Data( 'height', { type: 'number', default: 6 } );
 *
 * Possible options:
 *
 * type { Object }: 数据的类型
 *
 * detail { String }: 描述信息
 *
 * onlyChange { Boolean }: 当数据发生变化时才出发, 默认调用就触发
 *
 * default: 初始值
 *
 * callbacks options: 包括 callbacks 的配置
 *
 */
function Data () { }

z.extend( Data, {

    register ( name, options ) {
        if ( -1 !== z.inArray( name, _datas ) ) {
            throw new Error( `${ name } 已经注册了.` );
        }

        let { type, default: def } = options;
        let callbacks = z.Callbacks( options );
        let zType;

        // 添加的函数集合
        let _sub = [];

        options = z.isPlainObject( options ) ? options : { };
        options.name = name;

        if ( -1 === z.inArray( name, _datas ) ) {
            _datas.push( name );
        }

        z.extend( Data, {

            /**
             * 可操控队列的对象
             * @param { * } value 设置的值
             * @param { Object } context 修改队列上下文, 默认该函数
             */
            [ name ] ( value, context ) {

                context = z.isObject( context ) ? context : Data[ name ];

                if ( !z.isUndefined( value ) ) {
                    if ( type ) {
                        if ( type === ( zType = z.type( value ) ) ) {
                            fireWith.call( context, value, callbacks, name );
                        } else {
                            throw new Error( `设置的值类型错误: ${zType}. 正确: ${type}` );
                        }
                    } else {
                        fireWith.call( context, value, callbacks, name );
                    }
                }
                return Data[ name ]._data;
            }
        } );

        let _self = Data[ name ];

        z.extend( _self, {
            options,
            _data: type && type === z.type( def ) ? def : undefined,
            add: function ( ...rest ) {
                _sub.push( rest );
                callbacks.add( ...rest );
                return _self;
            },
            sub: function () {
                return concat.apply( [], _sub );
            },
            destory: function () {
                Data[ name ] = callbacks = null;
                _datas.splice( z.inArray( name, _datas ), 1 );
            }
        } );

        z.each( fns, ( _, fn ) => {
            _self[ fn ] = ( ...rest ) => {
                let ret = wrap( callbacks, fn, ...rest );
                return z.isObject( ret ) ? _self : ret;
            };
        } );
    },

    _datas () {
        return slice.call( _datas );
    },

    clear () {
        z.each( _datas, function ( index, ele ) {
            if ( Data[ ele ] && Data[ ele ].empty ) {
                Data[ ele ].empty();
                Data[ ele ] = null;
            }
        } );
        _datas = [];
    }
} );

if ( z.isWindow( this ) && z.isUndefined( this.Data ) ) {
    this.Data = Data;
}

function fireWith ( value, callbacks, name ) {
    let _self = Data[ name ];
    _old = _self._data;
    _cur = _self._data = value;

    if ( !_self.options.onlyChange || _old !== _cur ) {
        return callbacks.fireWith( this, [ value ] );
    }
}

function wrap ( callbacks, name, ...rest ) {
    return callbacks[ name ]( ...rest );
}

export default Data;
