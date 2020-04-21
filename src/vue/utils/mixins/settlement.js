/**
 * @file 运维管理中的结算跳转到任务列表 | 任务详情
 * @description
 *  在发起任务成功后, 在提示中添加提示语: 是否跳转到任务列表.
 *  按钮改成2个, 取消和跳转.
 *
 *  1. 配货单成本核算 => 发起预处理 => 任务列表
 *  2. 配送费结算 => 发起结算 => 任务列表
 *  3. 客诉赔付 => 发起结算 => 任务列表
 *  4. 维保运维 => 发起结算 => 任务列表
 *  5. 结算账单 => {
 *    奖罚金关账 => 任务列表
 *    自定义奖罚金关账 => 任务列表
 *  }
 */

export default {
  computed: {
    iTurnRoute() {
      return `是否跳转到任务列表？`
    },
    iSureTurn() {
      return `跳转`
    },
    iCancel() {
      return `取消`
    },
    iTip() {
      return `提示`
    },
  },
  methods: {
    /**
     * 跳转到任务列表
     * @description 任务详情路由: 90/data/InvoiceCheckDetail
     */
    goTaskList() {
      this.$router.push({
        path: '/90/TaskLog/TaskLog'
      })
    },
    /**
     * 任务完成提示框
     * @param { Object } options confirm条件
     */
    confirmCondition(options) {
      return {
        confirmButtonText: this.iSureTurn,
        cancelButtonText: this.iCancel,
        showCancelButton: true,
        distinguishCancelAndClose: true,
      }
    },
    /**
     * 提示框
     * @param { String } msg 提示内容
     * @param { Object } options 选项参数
     */
    confirm(msg, options) {
      return this.$confirm(`${msg}${this.iTurnRoute}`, this.iTip, {
        ...this.confirmCondition(),
        ...options,
      }).then(() => {
        // 点击跳转, 路由跳转到任务列表
        this.goTaskList()
      })
    },
  },
}
