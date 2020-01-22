import { once } from 'lodash'

/**
 * @file 进度条数据
 * @description
 *  1. done 之后不能执行start无效, 必须reset, 这样比较合理.
 * @todo
 *  1. 数据计算跟队列是分开的, 应该是2个类. 抽离出action
 */

const VERSION = `1.2.0`

const STATUS_WAIT = `wait`
const STATUS_STARTED = 'started'
const STATUS_DONE = 'done'

// 定义是有属性
const _status = Symbol('_status')
const _pause = Symbol('_pause')

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
    // timeoutAction: 10000,
}

export default class ZProgress {
    static version = VERSION

    static props = ['stopOnFalse', 'trickle', 'trickleSpeed', 'waitMax'/* , 'timeoutAction' */]

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

        setPropNoEnumerable(this, 'options', options)

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
     * @param { Fncntion } fn 进度条开始之前的回调.
     */
    start(fn) {
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
            if (isFunction(fn)) fn()
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
     * 获取进度条进度
     */
    get value() {
        return this._value
    }
    /**
     * 双向绑定设置进度条
     * @param { Number } value 设置进度条位置
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
 * 为目标对象设置不可遍历属性
 * @param { Object } target 目标对象
 * @param { String } prop 属性名
 * @param { Any } valule 目标对象属性值
 */
function setPropNoEnumerable(target, prop, value) {
    Object.defineProperty(target, prop, {
        value,
        enumerable: false,
        writable: true,
    })
}
