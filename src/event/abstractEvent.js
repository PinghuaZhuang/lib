/**
 *
 */

let cancelBubble = Symbol( 'cancel' );

class AbstractEvent {

    /**
     * 是否冒泡
     * @abstract
     * @type { Boolean }
     */
    static cancelable = false;

    constructor () {
        this[ cancelBubble ] = false;

        // this.data = data;
    }

    /**
     * 取消冒泡
     */
    cancel () {
        this[ cancelBubble ] = true;
    }
}

export default AbstractEvent;
