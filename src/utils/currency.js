
/**
 * 金额计算
 */
export const CurrencyCalc = {
    /**
     * 加减乘除
     * @param { Number | String } a 金额
     * @param { Number | String } b 金额或者被除数,乘数
     * @param { Number } precision 精度, 默认4位小数
     * @return { String } 金额转成字符串, 不是格式化后的
     */
    /* 加法 */
    add(a, b, precision = 4) {
      return '' + currency(a, { precision }).add(b).value
    },
    /* 减法 */
    sub(a, b, precision = 4) {
      return '' + currency(a, { precision }).subtract(b).value
    },
    /* 乘法 */
    multipy(a, b, precision = 4) {
      return '' + currency(a, { precision }).multiply(b).value
    },
    /* 除法 */
    distribute(a, b, precision = 4) {
      return '' + currency(
        currency(a, { precision }).intValue / b / Math.pow(10, precision),
        { precision }
      ).value
    },
    /**
     * 转换为2位小数
     * @param { Number | String } value 金额
     * @param { Object } opt currency的配置
     */
    turnCurrency(value, opt = { precision: 2, symbol: '' }) {
      return currency(value, opt).format()
    },
    /**
     * 转换为2位小数
     * @param { Number | String } value 金额
     * @param { Object } opt currency的配置
     */
    value(value, opt = { precision: 2, symbol: '' }) {
      return currency(value, opt).value
    },
  }
