/**
 * 过滤金钱
 * @description 存储4位, 显示2位, 显示',', 支持输入 '.2'
 * @version 1.0.0
 */

import Vue from 'vue'
import currency from 'currency.js/dist/currency'
import accounting from 'accounting'

window.currency = currency
window.accounting = accounting

accounting.settings.number.precision = 4
accounting.settings.currency.symbol = ''
accounting.settings.currency.precision = '4'

function init ( value ) {
    return value
}

currency( 189798790870, { precision: 5 } ).format()

function getInput ( el ) {
    if ( el.tagName.toLocaleUpperCase() !== 'INPUT' ) {
        el = el.getElementsByTagName( 'input' )[ 0 ]
    }
    return el
}

Vue.directive( 'money', {
    bind ( el, binding, vnode ) {
        let { value, oldValue, modifiers, expression } = binding
        // binding.value = accounting.formatMoney( value, undefined, 4 )
        el = getInput( el )
        el.addEventListener( 'input', () => {
            el.value = accounting.formatMoney( el.value )
            vnode.context[ expression ] = accounting.formatMoney( el.value )
        } )
        // el.setAttribute( 'value', accounting.formatMoney( value ) )
        el.value = accounting.formatMoney( value )

        // vnode.componentInstance.value = accounting.formatMoney( value )
        console.log( 'vnode:', vnode )
        console.log( 'bind:', el, value, oldValue, modifiers, vnode.componentInstance )
        window.setTimeout( () => {
            // el.value = accounting.formatMoney( value )
            // console.log( 'el:', el.value, el )
        }, 1 )
    },
    update ( el, { value, modifiers }, vnode ) {
        console.log( 'update:', el, value, modifiers, vnode )
        // vnode.data.attrs.value = value
        el.value = accounting.formatMoney( value )
    },
} )
