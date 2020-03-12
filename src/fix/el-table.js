/**
 * @file 修复 el-table 的一些问题
 */
export const fixLazyLoad = {
    methods: {
        /**
         * 修复表格懒加载不能快速点击的问题
         * @param { Vue } tableVm el-table的实例
         * @param { TableRow } row 行对象
         * @param { TreeNode } tree el-table的TreeNode实例
         */
        fixLazyLoad(tableVm, row, tree) {
            const { states } = tableVm.store
            const { treeData } = states
            const row = treeData[tree.id]

            Object.assign(row, {
                loaded: true,
                expanded: true,
                loading: false,
            })
        },
    }
}

/**
 * 修复表格固定栏出现错位的问题
 * @description 混入到 el-table 组件中
 */
export const fixLoyout = {
    created() {
        this.$watch('data', value => {
            if (value.length) {
                this.$nextTick(this.doLoyout)
            }
        })
    }
}
