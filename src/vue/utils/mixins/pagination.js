import { DEF_TABLE_PAGE_SIZE, DEF_TABLE_LOAD_FUNCTION } from '@/utils/setting'

/**
 * @file 分页器
 */
/*
  <MainPage
    ref="pagination"
    :current-page="pagination.currentPage"
    :page-size="pagination.pageSize"
    :total="pagination.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
*/
export default {
  data() {
    return {
      pagination: {
        currentPage: 1, // 当前页码
        pageSize: DEF_TABLE_PAGE_SIZE, // 默认显示条目
        total: 0, // 总页码
      },
    }
  },

  methods: {
    /**
     * 分页条目变化的事件
     * @description
     *  @size-change="handleSizeChange"
     * @param { Number } pageSize 条目数
     * @param { String | undefined } fnName 重新加载数据的函数名
     */
    handleSizeChange(pageSize, fnName = DEF_TABLE_LOAD_FUNCTION) {
      // 清空搜索条件
      // this.resetSearchCondition()
      this.pagination.currentPage = 1
      this.pagination.pageSize = pageSize
      if (typeof this[fnName] === 'function') {
        this[fnName]() // 重新加载数据
      }
    },
    /**
     * 页码发生变化触发的事件
     * @description 在直接修改currentPage的时候不会触发
     *  @current-change="handleCurrentPageChange"
     * @param { Number } 当前页码
     * @param { String | undefined } fnName 重新加载数据的函数名
     */
    handleCurrentChange(page, fnName = DEF_TABLE_LOAD_FUNCTION) {
      // 清空搜索条件
      // this.resetSearchCondition()
      this.pagination.currentPage = page;
      if (typeof this[fnName] === 'function') {
        this[fnName]() // 重新加载数据
      }
    },
  },
}
