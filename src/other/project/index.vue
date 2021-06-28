<template>
  <WidgetClassicView
    ref="wrap"
    :load="load"
    :table-attrs="tableAttrs"
    :table-listeners="tableListeners"
    :watermark="$user.watermarkStr"
    chunk
  >
    <div slot="filter" class="clearfix filter bd">
      <div class="filter-item">
        <span class="title">名称</span>
        <div class="content max key-word">
          <el-input v-model="filter.name" placeholder="请输入" />
        </div>
      </div>

      <div class="search-btn fr">
        <el-button class="reset" type="text" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="handleUpdate">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </div>
    </div>

    <template slot="table">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <WTable
            :data="scope.row.children"
          >
            <WTableColumn prop="name" label="协议名称" :formatter="protocolNameFormatter" />
            <WTableColumn prop="name" label="文件名" />
            <WTableColumn prop="last_commit.created_at" label="上次修改时间" :formatter="dateFormatterSecond" />
            <WTableColOperate label="操作" width="190">
              <template v-slot="$scope">
                <el-button type="text" size="mini" @click="handleRowEdit($scope, scope.row)">编辑</el-button>
                <el-button type="text" size="mini" class="danger" @click="handleRowDel($scope)">删除</el-button>
                <el-button type="text" size="mini" @click="handleDiff($scope)">Diff</el-button>
              </template>
            </WTableColOperate>
          </WTable>
        </template>
      </el-table-column>
      <WTableColumn prop="name" label="项目名称" />
      <WTableColumn prop="path" label="路径" />
      <WTableColumn prop="createTime" label="描述" />
    </template>

    <el-dialog
      :title="editTitleText"
      :visible.sync="editFormVisible"
      :before-close="handleBeforeClose"
      custom-class="dialog-form"
    >
      <el-form ref="form" :model="editForm" :rules="rules" label-width="82px">
        <el-form-item label="应用" prop="appPackage">
          <el-select v-model="editForm.appPackage" placeholder="请选择应用" @change="() => {}">
            <el-option
              v-for="(item, key) in []"
              :key="key"
              :label="item.label"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="代理商名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="渠道号" prop="name">
          <el-input v-model="editForm.channel" placeholder="请输入" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSumit">确 定</el-button>
      </span>
    </el-dialog>
  </WidgetClassicView>
</template>

<script>
import WidgetClassicView from 'widget/views/WClassicView'
import { cloneDeep } from 'lodash'
import { dateFormatter } from '@/mixins/tableColFormatter'
import { getTree, getProtocolWithPath } from '@/api/project'
import { mapState } from 'vuex'
import { PROTOCOL_NAMEMAP } from './enum'

const initFilterData = {
  name: undefined,
}

const initEditFormData = {
}

export default {
  name: 'ProjectList',
  components: {
    WidgetClassicView,
  },
  mixins: [WidgetClassicView.Update, dateFormatter],
  data() {
    return {
      tableAttrs: {
      }, // 表格参数
      tableListeners: {
        'expand-change': this.handleExpandChange,
      }, // 表格事件
      tableData: [], // 表格数据

      filter: cloneDeep(initFilterData), // 搜索条件
      editForm: {
        ...cloneDeep(initEditFormData),
      }, // 弹窗
      editFormVisible: false,
      editMode: 1, // 1: 新增 2: 编辑
      rules: {
        appPackage: { required: true, message: '请选择应用' },
        name: { required: true, message: '请输入应用' },
        channel: { required: true, message: '请输入渠道号' },
      },
    }
  },
  computed: {
    ...mapState({
      folder: state => state.project.folder,
    }),
    editTitleText() {
      return this.editMode === 1 ? '新增' : '编辑'
    },
  },
  activated() {
    this.handleUpdate()
  },
  methods: {
    /**
     * 加载数据
     * @return { Promise }
     */
    load(page = 1, pageSize = 10, total = 0) {
      return getTree({
        path: this.folder,
      }).then(res => {
        const ret = res.filter(o => {
          const fname = this.filter.name?.trim()
          const searchRet = (fname == null || fname === '')
            ? true
            : new RegExp(this.filter.name.trim()).test(o.name)
          if (searchRet) {
            o.children = []
          }
          return searchRet
        })
        this.tableData = ret
        return { tableData: ret, total: ret.length }
      })
    },
    handleExpandChange(expandedRows) {
      expandedRows = Array.isArray(expandedRows) ? expandedRows : [expandedRows]
      expandedRows.forEach(row => {
        if (row.firstLoad) return
        row.firstLoad = true

        // 获取协议列表
        getProtocolWithPath(row.path).then(res => {
          row.children = res
        })
      })
    },
    protocolNameFormatter(row, column, cellValue, index) {
      return PROTOCOL_NAMEMAP[cellValue.replace('.html', '')] || ''
    },
    handleDiff({ row }) {
      window.open(`http://git.miguan.com/video/ballvideo-H5/commit/${row.last_commit.id}`)
    },
    /**
     * 新增
     */
    handleAdd() {
      this.editMode = 1
      this.editFormVisible = true
    },
    /**
     * 操作-编辑
     */
    handleRowEdit({ row }, parentRow) {
      this.$router.push({
        name: 'Editor',
        query: {
          parentPath: parentRow.path,
          path: row.path,
        },
        params: {
          id: row.id,
        },
      })
    },
    /**
     * 操作-删除
     */
    handleRowDel(scope) {
      return this.$confirm('确定移除该记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.warning(`暂不支持删除`)
        // this.tableData.splice(scope.$index, 1)
        // this.$nextTick(() => {
        //   this.$message.success(`移除成功.`)
        // })
      })
    },
    /**
     * 添加编辑弹窗关闭回调
     */
    handleBeforeClose(next) {
      this.editForm = cloneDeep(initEditFormData)
      this.$refs.form && this.$refs.form.resetFields()
      next()
    },
    /**
     * 编辑新增提交事件
     */
    handleSumit() {
      this.$refs.form.validate().then(() => {
        this.$message.info('触发提交事件')
      })
    },
    /**
     * 重置表格
     */
    handleReset() {
      this.filter = cloneDeep(initFilterData)
      this.$refs.wrap && this.$refs.wrap.reLoad(true)
    },
    /**
     * 更新数据
     */
    handleUpdate() {
      // this.update()
      this.$refs.wrap && this.$refs.wrap.reLoad(true)
    },
    /**
     * 重置列宽
     */
    resetWidth() {
      const { table } = this.$refs.wrap.$refs
      table.handleResetWidth()
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
