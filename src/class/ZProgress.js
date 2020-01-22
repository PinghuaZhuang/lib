import { once } from 'lodash'

/**
 * @file 进度条数据
 * @description
 *  1. done 之后不能执行start无效, 必须reset, 这样比较合理.
 *  2. 默认10s超时后悔自动退出action.
 * @todo
 *  1. 数据计算跟队列是分开的, 应该是2个类. 抽离出action
 */

const VERSION = `1.0.0`

const STATUS_WAIT = `wait`
const STATUS_STARTED = 'started'
const STATUS_DONE = 'done'

// 定义是有属性
const _status = Symbol('_status')
const _pause = Symbol('_pause')
const _timer = Symbol('_timer')
const _pending = Symbol('_pending')

/**
 * 默认配置信息
 */
const settings = {
    /**
     * 开始后是否步进
     * @type { Boolean }
     */
    trickle: true,
    /**
     * 步进频率
     * @type { Number }
     */
    trickleSpeed: 200,
    /**
     * 队列执行返回false是否停止
     * @type { Boolean }
     */
    stopOnFalse: true,
    /**
     * 最小值
     * @type { Number }
     */
    min: 0,
    /**
     * 最大值
     * @type { Number }
     */
    max: 1,
    /**
     * 即将完成的最大值
     * @type { Number }
     */
    // waitMax: .994,
    waitMax: .98,
    /**
     * action超时时间
     * @type { Number }
     */
    timeoutAction: 10000,
}

export default class ZProgress {
    static version = VERSION

    static props = ['stopOnFalse', 'trickle', 'trickleSpeed', 'waitMax', 'timeoutAction']

    /**
     * 进度条进度
     * @type { Number } MIN-MAX 区间内的数字
     */
    _value = settings.min

    /**
     * @constructor
     */
    constructor(options = {}) {

        /**
         * 进度条状态
         * 未开始, 开始, 停止, 结束,
         * @type { String } 枚举, 不接受其他
         */
        this[_status] = STATUS_WAIT

        /**
         * 进度条计算是否暂停
         * @type { Boolean }
         */
        this[_pause] = false

        /**
         * window.requestAnimationFrame的id
         */
        this[_timer] = null

        /**
         * 队列
         * @type { Array }
         */
        this[_pending] = []

        this.options = options

        // 设置options
        ZProgress.props.forEach(k => (this.options[k] = getProp(k, options)))

        // 冻结配置
        if (Object.freeze) {
            Object.freeze(this.options)
        }
    }

    /**
     * 指定滚动条位置位置
     * @param { Number } value 指定数值
     */
    set(value) {
        if ((this._value = ZProgress.clamp(value)) >= 1) {
            this[_status] = STATUS_DONE
        }
        return this
    }

    /**
     * 进度条计算开始
     * @description 开始的时候并不一定是0.
     * @param { Fucntion | Boolean } isAction 为函数的时候, 进度条开始之前的回调.
     * @param { Fncntion | undefined } fn 进度条开始之前的回调.
     */
    start(isAction, fn) {
        // 如果已经完成
        if (this.isDone()) {
            // this.reset() // 重新开始
            return this
        }

        const work = () => {
            window.setTimeout(function () {
                if (!this.isStarted()) return
                if (!this[_pause]) this.trickle() // 是否暂停
                work()
            }.bind(this), this.options.trickleSpeed)
        }

        if (this.options.trickle) {
            if (isAction === true) {
                this.timer == null && this.action()
                if (isFunction(fn)) fn()
            } else {
                if (isFunction(isAction)) isAction()
            }
            work.call(this)
            this[_status] = STATUS_STARTED
            this[_pause] = false
        }

        return this
    }

    /**
     * 进度条计算完成
     * @param { Fucntion } fn 进度条完成时触发的回调
     */
    done(fn) {
        // if (!this.isStarted()) return this
        this.cancel()
        this.inc(.3 + .5 * Math.random()).set(1)
        this[_status] = STATUS_DONE
        this[_pause] = false
        if (isFunction(fn)) fn()
        return this
    }

    /**
     * 进度条计算暂停
     */
    pause() {
        this[_pause] = true
        return this
    }

    /**
     * 进度条计算停止
     * @description 需要一个是否stop的标识
     */
    stop() {
        return this.reset()
    }

    /**
     * 重置进度条状态 && 重置队列的执行
     */
    reset() {
        this[_status] = STATUS_WAIT
        this[_pause] = false
        this.set(0)
        this.cancel()
        return this
    }

    /**
     * 清空队列
     */
    cleanQueue() {
        this[_pending] = []
        return this
    }

    /**
     * 步进
     * @param { Number } amount 步进距离
     */
    inc(amount) {
        const n = this.value
        if (this.value >= 1) return this
        if (!isNumber(amount)) {
            if (n >= 0 && n < .2) { amount = .1 }
            else if (n >= .2 && n < .5) { amount = .04 }
            else if (n >= .5 && n < .8) { amount = .02 }
            else if (n >= .8 && n < .99) { amount = .005 }
            else { amount = 0 }
        }
        return this.set(ZProgress.clamp(n + amount, 0, this.options.waitMax))
    }

    /**
     * 步进别名
     */
    trickle() {
        return this.inc()
    }

    /**
     * 是否开始
     * @return { Boolean }
     */
    isStarted() {
        return this[_status] === STATUS_STARTED
    }

    /**
     * 是否结束了
     * @description 在停止状态下返回, 不执行.
     * @return { Boolean }
     */
    isDone() {
        return this[_status] === STATUS_DONE
    }

    /**
     * 是否开始队列
     * @return { Boolean }
     */
    isQueue() {
        return this[_timer] == null
    }

    /**
     * 队列中添加回调
     * @param { Function } fn 添加的回调
     */
    queue(fn) {
        // 添加队列时, 已经在执行? 不考虑
        this[_pending].push(fn)
        return this
    }

    /**
     * 队列中删除队列
     * @param { Fucntion } 要从队列中删除的回调
     * @description 与jquery不同, 不执行队列.
     */
    dequeue(fn) {
        const index = this[_pending].findIndex(f => f === fn)
        if (index != -1) {
            this[_pending].splice(index, 1)
        }
        return this
    }

    /**
     * 执行队列
     * @param { Number } t requestAnimationFrame的参数
     */
    startQueue(t) {
        let i = -1
        while (++i < this[_pending].length) {
            const fn = this[_pending][i]
            if (isFunction(fn) && !this[_pause]) {
                if (fn(this.value, t) === false && this.options.stopOnFalse) {
                    break
                }
            }
        }
        return this
    }

    /**
     * 开始执行队列
     * @param { Number } t 时间
     */
    _action(t) {
        this[_timer] = window.requestAnimationFrame(this._action.bind(this))
        this.startQueue(t)

        // 结束时结束action
        if (this.isDone()) {
            this.cancel()
        }
        return this
    }

    /**
     * 开始animation
     * @description 添加超时
     */
    _handleAction() {
        window.setTimeout(function () {
            console.warn(`>>> action执行超时, 自动退出.`, this.options)
            if (isFunction(this.options.onTimeoutAction)) {
                this.options.onTimeoutAction()
            }
            this.cancel()
        }.bind(this), this.options.timeoutAction)
        return this._action()
    }

    /**
     * 开始执行队列
     * @description 添加只执行一次
     */
    action = once(this._handleAction)

    /**
     * 停止requestAnimationFrame
     */
    cancel() {
        window.cancelAnimationFrame(this[_timer])
        this[_timer] = null
        this.action = once(this._handleAction)
        return this
    }

    /**
     * 获取进度条进度
     */
    get value() {
        return this._value
    }
    /**
     * 双向绑定设置进度条
     */
    set value(value) {
        this.set(value)
    }

    /**
     * 根据目标值返回在最大值最小值区间的值
     * @param { Number } n 目标值
     * @param { Number } min 最小值
     * @param { Number } max 最大值
     * @return { Number }
     */
    static clamp(n, min = settings.min, max = settings.max) {
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
 * 判断目标对象是否为数字
 * @param { Any } target 判断的目标对象
 */
function isNumber(target) {
    return typeof target === 'number'
}

/**
 * 为实例设置属性
 * @param { String } prop 属性名
 * @param { Object } options 配置
 */
function getProp(prop, options) {
    return (prop in options) ? options[prop] : settings[prop]
}

/**
 * 进度条队列
 * @todo 从 ZProgress 中抽离出来
 */
export class ZProgressCallbacks {}
