/**
 * @file 搜索条件, 搜索框
 * @description 与 pagination 一起使用
 */

export default {
  data() {
    return {
      // 搜索条件
      // searchCondition: {},
    }
  },
  methods: {
    /**
     * 重置搜索条件
     * @param { Event } e
     * @param { String } fnName 非必填
     */
    resetSearch(e) {
      this.resetSearchCondition()
      this.searchChange()
    },
    /**
     * 重置搜索条件
     */
    resetSearchCondition() {
      const target = this.searchCondition
      if (target == null) {
        console.error(`<<< 请定义搜索条件 searchCondition. 例: searchCondition: { type: '' }`)
      }
      let key
      for (key in target) {
        target[key] = ''
      }
      this.$emit('resetSearchConditionAfter', this.searchCondition)
    },
    /**
     * 点击搜索
     * @param { Event } e
     * @param { String } fnName 非必填
     */
    searchChange(e, pagination = {}) {
      // 点击搜索的时候返回第一页
      pagination.currentPage = 1
      // 重新加载数据
      if (typeof this.loadTable === 'function') {
        return this.loadTable()
      }
    },
  },
}
