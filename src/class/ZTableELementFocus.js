class ZTableELementFocus {
    constructor(tableData) {
        this.$_trs = []
    }

    /* 右 */
    next () {}

    /* 左 */
    pre () {}

    /* 上 */
    up () {}

    /* 下 */
    down () {}

    /**
     * 新增|获取 行对象
     * @param { ELEMENT<tr> | Nunber } tr 表格行对象|获取tr行对象的索引
     * @return { ZTableELementFocusRow } 返回行对象
     */
    row() {}

}

class ZTableELementFocusRow {

}
