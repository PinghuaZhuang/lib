import Vue from 'vue'

/**
 * 表格用于转换金额格式
 */
export const formatterCurreny = {
  methods: {
    /**
     * 金额格式转换, 用于导出
     */
    handleFormatterCurreny(row, column, cellValue) {
      return Vue.filter('currency')(cellValue)
    },
  }
}

/**
 * 转换税率, 小数 => 分比
 */
export const formatterPercentage = {
  methods: {
    handleFormatterPercentage(row, column, cellValue) {
      if (Number.isNaN(cellValue)) {
        return ''
      }
      return Math.floor(+cellValue * 100) + '%'
    },
  }
}
