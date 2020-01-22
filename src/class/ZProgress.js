/**
 * @file 进度条数据
 * @todo
 *  1. window.requestAnimationFrame 兼容. 在这里执行队列提高性能.
 *  2. 是否需要加入事件的概念. (在requestAnimationFrame执行?)
 *  3. 是否不需要暂停?
 *  4. 数据计算跟队列是分开的, 应该是2个类.
 */

 const STATUS_WAIT = `wait`
 const STATUS_STARTED = 'started'
 const STATUS_DONE = 'done'

export default class ZProgress {
    static version = `0.0.2`

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
     * window.requestAnimationFrame的id
     */
    _timer = null

    /**
     * 队列
     * @type { Array }
     */
    _pending = []

    /**
     * 在执行队列的时候, 回调返回false是否停止队列
     * @todo 停止队列的时候是否记录索引?
     */
    _stopOnFalse = true

    /**
     * @constructor
     */
    constructor(options = {}) {
        this.options = options
        Object.freeze && Object.freeze(options)

        // 是否开启stopOnFalse
        this._stopOnFalse = ('stopOnFalse' in options) ? options.stopOnFalse : true
    }

    /**
     * 指定滚动条位置位置
     */
    set(value) {
        value = ZProgress.clamp(value)
        return this
    }

    /**
     * 进度条计算开始
     * @description 开始的时候并不一定是0.
     * @param { Fucntion | Boolean } start 为函数的时候, 执行对列之前执行.
     */
    start() {
        return this
    }

    /**
     * 进度条计算完成
     */
    done() {
        return this
    }

    /**
     * 进度条计算暂停
     */
    paus() {
        return this
    }

    /**
     * 进度条计算停止
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
        this.cancel()
        this._status = STATUS_WAIT
        this._pending = []
        this._qindex = -1
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
        return this._status === STATUS_STARTED
    }

    /**
     * 是否结束了
     * @description 在停止状态下返回, 不执行.
     */
    isDone() {
        return this._status === STATUS_DONE
    }

    /**
     * 是否开始队列
     */
    // isQueue() {}

    /**
     * 队列中添加回调
     * @param { Function } fn 添加的回调
     */
    queue(fn) {
        // 添加队列时, 已经在执行? 不考虑
        this._pending.push(fn)
        return this
    }

    /**
     * 队列中删除队列
     * @param { Fucntion } 要从队列中删除的回调
     * @description 与jquery不同, 不执行队列.
     */
    dequeue(fn) {
        const index = this._pending.findIndex(f => f === fn)
        if (index != -1) {
            this._pending.splice(index, 1)
            // 已经开始action, 判断索引.
            if (index < this._qindex) {
                this._qindex--
            }
        }
        return this
    }

    /**
     * 执行队列
     * @param { Number } requestAnimationFrame的参数
     */
    startQueue = (function () {
        function next(value, t) {
            const fn = this._pending[++this._qindex]
            if (isFunction(fn)) {
                if (fn(value)) {
                    next.call(this, value, t)
                } else if (!this._stopOnFalse) {
                    next.call(this, value, t)
                } else {
                    // TODO: 是否需要在这里重置索引?
                    this._qindex = -1
                }
            } else if (this._qindex >= this._pending.length) {
                // TODO: 是否需要在这里重置索引?
                this._qindex = -1
            }
        }
        return function (t) {
            if (this._pending.length >= 1) {
                next.call(this, this.value, t)
            }
            return this
        }
    })()

    /**
     * 开始执行队列
     * @param { Number } t 时间
     * @todo 只执行一次
     */
    action(t) {
        this._timer = window.requestAnimationFrame(this.action.bind(this))
        this.startQueue(t)

        // 结束时 || value >= 1 结束action
        if (this.isDone() || this.value >= 1) {
            this.cancel()
        }
        return this
    }

    /**
     * 停止requestAnimationFrame
     */
    cancel() {
        window.cancelAnimationFrame(this._timer)
        this._timer = null
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
     * 设置进度条进度
     * @param { Number } value
     */
    set value(value) {
        this._value = ZProgress.clamp(value)
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


/**
 * 判断目标对象是否为函数
 * @param { Any } fn 目标对象
 * @return { Boolean }
 */
function isFunction(fn) {
    return typeof fn === 'function'
}

/**
 * 进度条队列
 * @todo 从 ZProgress 中抽离出来
 */
export class ZProgressCallbacks {}
