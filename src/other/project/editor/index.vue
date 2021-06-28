<template>
  <div class="editor-view">
    <WidgetWrap ref="splitHeader" class="editor-header">
      <el-select v-model="section" class="editor-header-select" placeholder="请选择">
        <el-option v-for="(item, index) in structure" :key="index" :label="item.section" :value="item.section" />
      </el-select>
      <el-button type="primary" size="max" @click="handleDeploy">部署</el-button>
    </WidgetWrap>

    <WidgetWrap ref="splitContent" class="editor-split">
      <!-- <div class="editor-split-tree">
        111
      </div> -->
      <div class="editor-split-content">
        <split-pane
          :min-percent="20"
          :default-percent="50"
          split="vertical"
          @resize="getContentHeight"
        >
          <EditorQuill ref="quill" slot="paneL" :height="txtHeight" :source="contentHtml" @input="handleUpdateContentHtml" />
          <EditorPreview slot="paneR" :html="body" :head="head" />
        </split-pane>
      </div>
    </WidgetWrap>
  </div>
</template>

<script>
import EditorQuill from './quill'
import EditorPreview from './preview'
import Editor from './utils/Editor'
import { getFileContent } from '@/api/project'

export default {
  name: 'Editor',
  components: {
    EditorQuill,
    EditorPreview,
  },
  data() {
    // data:text/html;charset=utf-8;base64
    return {
      id: '',
      source: '',
      t_sourceHtml: '',
      sourceHtml: '',
      body: '',
      head: '',
      structure: {},
      section: undefined,
      txtHeight: undefined,
    }
  },
  computed: {
    contentHtml: {
      get() {
        const target = this.structure[this.section]
        return target == null ? '' : target.content
      },
      set(val) {
        const target = this.structure[this.section]
        if (val) {
          this.body = Editor.replaceSection(this.body, target, val)
        }
      },
    },
  },
  watch: {
    '$route.params.id'(val) {
      if (this.$route.name === 'Editor' && val) {
        this.init()
      }
    },
  },
  beforeCreate() {
    // if (this.$route.params.title == null) {
    //   this.$router.push({ name: 'ProjectList' })
    // }
  },
  created() {
    // this.$store.commit('tagsView/UPDATE_TITLE', this.$route.fullPath)
    this.init()
  },
  mounted() {
    this.$nextTick(() => {
      this.getContentHeight()
      window.addEventListener('resize', this.getContentHeight)
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getContentHeight)
  },
  methods: {
    init() {
      const { path, parentPath } = this.$route.query
      this.id = this.$route.params.id

      return getFileContent(path).then(res => {
        const source = res.content
        const sourceHtml = Editor.parseBase64ToHtml(source)
        const body = Editor.parseBody(sourceHtml)
        const head = Editor.parseHead(sourceHtml, parentPath)
        const structure = Editor.structureObj(body)
        console.log(structure, 'opopopp')

        Object.assign(this, {
          source,
          sourceHtml,
          body,
          head,
          structure,
          section: this.section || Object.keys(structure)[0],
        })
      })
    },
    getContentHeight() {
      const height = this.$el.getBoundingClientRect().height - this.$refs?.splitHeader.$el.getBoundingClientRect().height
      // this.height = height + 'px'
      this.txtHeight = height - 50 - (document.querySelector('.ql-toolbar')?.getBoundingClientRect().height || 0)
      return height
    },
    handleUpdateContentHtml(val) {
      this.contentHtml = val
    },
    handleDeploy() {},
  },
}
</script>

<style lang="scss" scoped>
.editor-view {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px - 45px);
}
.editor-split-tree {
  width: 200px;
  height: 100%;
  margin-right: 10px;
}
.editor-split-content {
  flex: 1;
}
.editor-header-select {
  margin-right: 24px;
}
</style>

<style lang="scss">
#app.__light__ .editor-split {
  flex: 1;
  display: flex;
  flex-direction: column;

  .box-plot {
    padding: 0 !important;
    height: 100%;
    flex: 1;
    display: inherit;
    flex-direction: row;

    .splitter-pane-resizer.vertical {
      padding: 0;
      margin-left: -6px;
      width: 10px;
      background-color: #eef0f3;
      opacity: 1;
      z-index: 1000;
      border: none;
    }

    .vue-splitter-container {
      flex: 1;

      .splitter-pane {
        padding: 20px;
      }

      .splitter-paneL {
        padding-right: 26px;
      }
    }
  }
}
</style>
