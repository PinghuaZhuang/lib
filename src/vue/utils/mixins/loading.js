/**
 * @file loading
 */

export function getLoading(propName) {
  return {
    data() {
      return {
        [propName]: false,
      }
    },
    methods: {
      [`${propName}Open`]() {
        this[propName] = true
      },
      [`${propName}Close`]() {
        this[propName] = false
      },
    },
  }
}

export default {
  data() {
    return {
      isLoading: false,
    }
  },

  methods: {
    openLoading() {
      this.isLoading = true
    },
    closeLoading() {
      this.isLoading = false
    },
  },
}
