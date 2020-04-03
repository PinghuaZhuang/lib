import { createDecorator } from 'vue-class-component'

export default createDecorator((options, key) => {
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
