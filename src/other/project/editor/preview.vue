<template>
  <div class="editor-preview">
    <div class="editor-preview-toolbar">
      <el-button-group>
        <el-button size="medium"><svg-icon icon-class="mobile" /></el-button>
        <el-button size="medium"><svg-icon icon-class="pc" /></el-button>
        <el-button size="medium" icon="el-icon-full-screen" />
      </el-button-group>
    </div>
    <div class="editor-preview-content">
      <!-- <el-card class="mobile ql-snow ql-editor" v-html="html" /> -->
      <el-card class="mobile">
        <ne-editor-preview ref="preview" :key="$route.path" />
      </el-card>
      <!-- eslint-disable-next-line -->
    </div>
  </div>
</template>

<script>
import './utils/preview-shadow-dom'

export default {
  name: 'EditorPreview',
  props: {
    html: {
      type: String,
      default: '',
    },
    head: {
      type: String,
      default: '',
    },
  },
  watch: {
    html() {
      this.updateHtml()
    },
  },
  activated() {
    this.updateHtml()
  },
  mounted() {
    this.updateHtml()
  },
  methods: {
    updateHtml() {
      console.log('updatehtml')
      const { preview } = this.$refs
      if (preview == null) return console.log('9999 ')
      preview.init(this.head)
      this.html.length && preview.update(this.html)
    },
  },
}
</script>

<style lang="scss" scoped>
.editor-preview {
  display: flex;
  flex-direction: row-reverse;
  height: 100%;
  overflow: hidden;
}

.editor-preview-toolbar {
  // height: 100px;
  width: 46px;
  margin-bottom: 10px;
}

.editor-preview-content {
  flex: 1;

  .mobile {
    display: block;
    width: 375px;
    margin: auto;
    max-height: 100%;

    ::v-deep .el-card__body {
      padding: 0;
    }
  }
}

::v-deep .el-button-group {
  display: flex;
  width: 36px;
  flex-direction: column;
  margin-left: 10px;

  .el-button {
    width: 36px;
    min-width: auto;
    padding-left: 0;
    padding-right: 0;
  }

  > .el-button:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  > .el-button:last-child {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
}

.mobile {
  overflow-y: auto;

  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(144, 147, 153, .3);
    border-radius: 20px;
  }
}
</style>
