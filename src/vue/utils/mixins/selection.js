/**
 * @file 表格的选择
 * @description
 *  @selection-change="handleSelecttionChange"
 */
export default {
  data() {
    return {
      /**
       * 选中的数据
       */
      selection: [],

      /**
       * 用户是否有选中
       */
      selectionDisable: true,
    }
  },
  methods: {
    /**
     * 当选择项发生变化时会触发该事件
     * @param { Array } selection
     */
    handleSelecttionChange(selection) {
      this.selectionDisable = (selection.length <= 0)
      // this.handleSelecttionChange.selection = selection
      this.selection = selection
    }
  },
}
