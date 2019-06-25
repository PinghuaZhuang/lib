/**
 * 全屏( 绑定了 F11 键 )
 * @example 整个页面: requestFullScreen( document.documentElement );
 * @example 某个元素: requestFullScreen( document.querySelect( '' ) )
 * @param { Dom } element 需要全屏的对象
 */
export function requestFullScreen ( element ) {
    let requestMethod = element.requestFullScreen || element.webkitRequestFullScreen ||
            element.mozRequestFullScreen || element.msRequestFullScreen;

    if ( requestMethod ) {
        requestMethod.call( element );
    } else if ( typeof window.ActiveXObject !== 'undefined' ) {
        let wscript = new ActiveXObject( 'WScript.Shell' );
        if ( wscript !== null ) {
            wscript.SendKeys( '{F11}' );
        }
    }
};

/**
 * 退出全屏( 绑定了 F11 键 )
 */
export function exitFullScreen () {

    // 判断各种浏览器，找到正确的方法
    let exitMethod = document.exitFullscreen || //W3C
        document.mozCancelFullScreen ||         //Chrome等
        document.webkitExitFullscreen ||        //FireFox
        document.webkitExitFullscreen;          //IE11
    if ( exitMethod ) {
        exitMethod.call( document );
    } else if ( typeof window.ActiveXObject !== 'undefined' ) {   //for Internet Explorer
        let wscript = new ActiveXObject( 'WScript.Shell' );
        if ( wscript !== null ) {
            wscript.SendKeys( '{F11}' );
        }
    }
};
