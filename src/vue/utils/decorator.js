import { createDecorator } from 'vue-class-component'

/**
 * 设置computed中cache为false
 */
export const NoCache = createDecorator((options, key) => {
  if (!('computed' in options)) {
    options.computed = {}
  }

  const fn = options.methods[key]

  options.computed[key] = {
    cache: false,
    get() {
      return fn.call(this)
    }
  }

  delete options.methods[key]
})

/**
 * 添加混入
 */
export function Mixins(...rest) {
  return createDecorator((options) => {
    if (!('mixins' in options)) {
      options.mixins = rest
    } else {
      options.mixins.push(...rest)
    }
  })
}

/**
 * 打印信息
 * @description reset: Array<String>
 * @param { String } prop 不必需.vue实例的属性名, 不传打印函数结果
 */
export const Log = createDecorator((props, key) => {
  if (process.env.VUE_APP_NODE_ENV === 'prod') return

  const fn1 = props.methods[key]

  if (typeof props !== 'string') {
    props.methods[key] = function(...rest) {
      const ret = fn1.call(this, ...rest)
      console.log(`${key} result:`, ret)
      return ret
    }
    return
  }

  return createDecorator((options, key) => {
    const fn2 = options.methods[key]
    props = props.split(' ')

    options.methods[key] = function(...rest) {
      const ret = fn2.call(this, ...rest)
      props.forEach(prop => console.log(`${prop}:`, this[prop]))
      return ret
    }
  })
})
