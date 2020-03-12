/**
 * @file 用于修复popover位置偏差的问题
 */

/**
 * 用于修复popover弹窗在小窗口中位置偏差的问题
 * @description
 *  @show="beforeShowTreeL4Popover"
 *  @after-enter="showTreeL4Popover"
 */
export const popoverFix = {
    methods: {
      /**
       * el-popover 显示之前
       */
      beforeShowTreeL4Popover() {
        document.querySelectorAll(`body > .el-popover`).forEach(ele => {
          ele.style.opacity = '0'
        })
      },
      /**
       * el-popover 显示之后
       */
      showTreeL4Popover() {
        window.dispatchEvent(new Event('resize'))
        window.setTimeout(_ => {
          let ids = document.querySelectorAll(`.el-table__fixed-body-wrapper .el-popover__reference`)
          if (ids == null) {
            return console.error(`popover error.`)
          }
          ids = Array.from(ids)
          ids = ids.map(el => el.getAttribute(`aria-describedby`))
          document.querySelectorAll(`body > .el-popover`).forEach(ele => {
            if (!ids.includes(ele.id)) {
              ele.style.opacity = '1'
            } else {
              ele.style.display = 'none'
            }
          })

          // 显示popover
          this.$emit('showTreeL4Popover')
        }, 10)
      },
    }
  }
