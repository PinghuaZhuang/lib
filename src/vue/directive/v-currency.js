import Vue from 'vue'
import accounting from 'accounting'

const INSERT = 'insertText'
const INSERT_PASE = 'insertFromPaste'
const DELETE = 'deleteContentBackward'

/* 'symbol precision thousand decimal' */
// accounting.settings.currency.symbol = ''
accounting.settings.currency.precision = 4

function getInput ( el ) {
    if ( el.tagName.toLocaleUpperCase() !== 'INPUT' ) {
        el = el.getElementsByTagName( 'input' )[ 0 ]
    }
    return el
}

function setCursor ( el, position ) {
    let setSelectionRange = function () {
        el.setSelectionRange( position, position )
    }
    if ( el === document.activeElement ) {
      setSelectionRange()
      setTimeout( setSelectionRange, 1 ) // Android Fix
    }
}

function handleInput ( $e ) {
    let target = $e.target, { symbol, decimal } = accounting.settings.currency
    let decimalReg = '\\' + decimal
    let reg = `[0-9]+${decimalReg}[0-9]*${decimalReg}`, regReplace = `([0-9]+${decimalReg}[0-9]*)(${decimalReg})`
    let value = target.value, data = $e.data
    let isTwoDcimal = $e.data === decimal && new RegExp( reg ).test( target.value )
    let isFirstInput = $e.data === decimal && target.value === decimal

    if ( $e.inputType !== DELETE ) { // 插入
        if ( isTwoDcimal ) { // 连续输入 '.', 替换第二个
            value = value.replace( new RegExp( regReplace ), '$1' )
        }
        this.$emit( 'input', accounting.formatMoney( value || '' ) )
    }

    let positionFromEnd = value.length - target.selectionEnd
    positionFromEnd = Math.max( positionFromEnd, symbol.length ) // right
    positionFromEnd = value.length - positionFromEnd
    positionFromEnd = Math.max( positionFromEnd, 1 ) // left

    if ( isFirstInput ) { // 第一次输入
        positionFromEnd += 1
    } else if ( isTwoDcimal ) { // 连续输入 '.'
        positionFromEnd = value.indexOf( decimal ) + 1
    } else if ( !/[0-9]|\./.test( data ) ) { // 输入非数字 
        positionFromEnd -= 1
    }

    setCursor( target, positionFromEnd )
}

Vue.directive( 'currency', {
    bind ( el, binding, vnode ) {
        let vm = vnode.componentInstance
        el = getInput( el )
        el.handleInput = handleInput.bind( vm )
        el.addEventListener( 'input', el.handleInput )
    },
    unbind (  el, { value, modifiers }, vnode ) {
        getInput( el ).removeEventListener( 'input', el.handleInput )
        delete el.handleInput
    },
} )
