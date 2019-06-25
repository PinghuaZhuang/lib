/**
 * @file 浏览器切换窗口触发的事件
 */
import prefixes from './var/prefixes';
import document from '../var/document';

const VISI = 'visibilityState';
const VISI_UP = VISI[ 0 ].toUpperCase() + VISI.slice( 1 );

// 获取 document.visibilityState 属性
export function getVisibilityState () {
    if ( [ VISI ] in document ) {
        return VISI;
    }

    for ( var i = 0; i < prefixes.length; i++ ) {
        if ( ( prefixes[ i ] + VISI_UP ) in document ) {
            return prefixes[ i ] + VISI_UP;
        }
    }

    console.error( 'otherwise it\'s not supported' );
    return null;
};
