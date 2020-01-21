/**
 * @file 进度条数据
 * @todo
 *  1. window.requestAnimationFrame 兼容. 在这里执行队列提高性能.
 *  2. 是否需要加入事件的概念. (在requestAnimationFrame执行?)
 */

 const STATUS_WAIT = `wait`
export default class ZProgress {
    static version = `0.0.1`

    static MIN = 0
    static MAX = 1

    /**
     * 进度条进度
     * @type { Number } MIN-MAX 区间内的数字
     */
    _value = 0

    /**
     * 进度条状态
     * 未开始, 开始, 停止, 结束,
     * @type { String } 枚举, 不接受其他
     */
    _status = STATUS_WAIT

    /**
     * 队列是否暂停
     * @type { Boolean }
     */
    _qpause = false

    /**
     * 队列执行的索引
     * @type { Number }
     */
    _qindex = -1

    /**
     * @constructor
     */
    constructor() {}

    /**
     * 指定滚动条位置位置
     */
    set(value) {
        value = ZProgress.clamp(value)
        return this
    }

    /**
     * 进度条开始
     * @description 开始的时候并不一定是0.
     * @param { Fucntion | Boolean } start 为函数的时候, 执行对列之前执行.
     */
    start() {
        return this
    }

    /**
     * 进度条完成
     */
    done() {
        return this
    }

    /**
     * 进度条停止
     * @description 需要一个是否stop的标识
     */
    stop() {
        return this
    }

    /**
     * 重置进度条状态
     */
    reset() {
        this.set(0)
        this._status = STATUS_WAIT
        return this
    }

    /**
     * 步进
     */
    inc() {
        return this
    }

    /**
     * 是否开始
     * @return { Boolean }
     */
    isStart() {

    }

    /**
     * 是否结束了
     * @description 在停止状态下返回, 不执行.
     */
    isDone() {

    }

    /**
     * 是否开始队列
     */
    // isQueue() {}

    /**
     * 修改valueOf方法用于方便计算
     */
    // valueOf() {}

    /**
     * 队列中添加回调
     * @param { Function } fn 添加的回调
     */
    queue() {
        return this
    }

    /**
     * 队列中删除队列
     * @description 与jquery不同, 不执行队列.
     * @return
     */
    dequeue() {
        return this
    }

    /**
     * 执行队列
     */
    startQueue() {
        return this
    }

    /**
     * 暂停队列
     */
    pauseQueue() {
        return this
    }

    /**
     * 获取进度条进度
     */
    get value() {
        // return ZProgress.clamp(this._value)
        return this._value
    }

    /**
     * 根据目标值返回在最大值最小值区间的值
     * @param { Number } n 目标值
     * @param { Number } min 最小值
     * @param { Number } max 最大值
     * @return { Number }
     */
    static clamp(n, min = ZProgress.MIN, max = ZProgress.MAX) {
        if (n < min) return min
        if (n > max) return max
        return n
    }
}
