<template>
  <div class="s-dialog-table">
    <el-table :data="tableData" border max-height="50vh"
        v-loading="loading">
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
        loading: true,

        tableData: [ ], // 表格数据

        // lazyLoad
    }
  },

  props: {
      lazy: {
          type: Number,
          default: true
      },
      lazyLoad: {
          type: Function
      }
  },

  created () {
      if ( this.lazy ) {
          this._lazyLoad ()
      }
  },

  methods: {
        render ( data ) {
            if ( !Array.isArray( data ) ) {
                this.closeLoading()
                return
            }
            this.tableData = data
            this.$nextTick( () => this.closeLoading() )
        },
        _lazyLoad () {
            if ( typeof this.lazyLoad === 'function' ) {
                this.lazyLoad( this.render )
            }
        },
        closeLoading () {
            this.loading = false
        },
    }
};
</script>

<style lang="scss" scoped>
.s-dialog-table {

}
</style>
