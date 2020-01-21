/**
 * @file 进度条数据
 * @todo
 *  1. window.requestAnimationFrame 兼容.
 *  2. 是否需要加入事件的概念. (在requestAnimationFrame执行?)
 */

export default class ZProgress {
    static version = `0.0.0`

    constructor() {}

    /**
     * 指定位置
     */
    set() {}

    /**
     * 开始
     */
    start() {}

    /**
     * 进度条完成
     */
    done() {}

    /**
     * 步进
     */
    inc() {}

    /**
     * 是否开始
     * @return { Boolean }
     */
    isStart() {}

    /**
     * 修改valueOf方法用于方便计算
     */
    valueOf() {}

    /**
     * 进队
     */
    queue() {}

    /**
     * 出队
     */
    dequeue() {}

    get value() {}

    /**
     * 根据目标值返回在最大值最小值区间的值
     * @param { Number } n 目标值
     * @param { Number } min 最小值
     * @param { Number } max 最大值
     * @return { Number }
     */
    static clamp(n, min, max) {
        if (n < min) return min
        if (n > max) return max
        return n
    }
}
