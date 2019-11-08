<template>
    <s-dialog class="s-dialog-table"
        v-bind="$attrs"
        v-on="$listeners">

        <Table slot="container"
            :lazy="true"
            :lazyLoad="lazyLoad"
        ></Table>
    </s-dialog>
</template>

<script>
/**
 * 样式为表格的 dialog
 */

import Table from './components/table'
import SDialog from './index'

export default {
    name: 's-dialog-table',
    components: {
        SDialog,
        Table,
    },
    methods: {
        lazyLoad ( next ) {
            window.setTimeout( () => next( [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }] ), 1000 )
        }
    }
}
</script>
