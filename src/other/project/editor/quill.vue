<template>
  <div :id="id" ref="editor" :style="{ height: height == null ? 'auto' : height + 'px' }" />
</template>

<script>
import { getUUID } from '@/utils'
import Quill from 'quill'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

export default {
  name: 'EditorQuill',
  props: {
    height: {
      type: Number,
      default: undefined
    },
    source: {
      type: String,
      default: '',
    },
  },
  data() {
    const uuid = getUUID()
    const sourceHtml = this.source
    return {
      sourceHtml,
      content: '',
      uuid,
      id: `quill-${uuid}`,
    }
  },
  watch: {
    // Watch content change
    source(newVal) {
      if (this.quill) {
        if (newVal && newVal !== this.content) {
          this.sourceHtml = this.source
          this.quill.pasteHTML(this.sourceHtml)
        } else if (!newVal) {
          this.quill.setText('')
        }
      }
    },
    // Watch content change
    value(newVal) {
      if (this.quill) {
        if (newVal && newVal !== this.content) {
          this.quill.pasteHTML(newVal)
        } else if (!newVal) {
          this.quill.setText('')
        }
      }
    },
    // Watch disabled change
    disabled(newVal) {
      if (this.quill) {
        this.quill.enable(!newVal)
      }
    }
  },
  mounted() {
    this.initialize()
  },
  beforeDestroy() {
    this.quill = null
    delete this.quill
  },
  methods: {
    initialize() {
      this.createQuill()

      if (this.value || this.source) {
        this.quill.pasteHTML(this.value || this.sourceHtml)
        this.$emit('input', this.$refs.editor.children[0].innerHTML)
      }

      if (!this.disabled) {
        this.quill.enable(true)
      }

      this.setListeners()
    },
    createQuill() {
      if (this.quill) return

      this.quill = new Quill(`#${this.id}`, {
        theme: 'snow',
        boundary: document.body,
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image', 'video']
          ]
        },
        placeholder: 'Insert text here ...',
        readOnly: false,
      })
      return this.quill
    },
    setListeners() {
      this.quill.on('selection-change', range => {
        if (!range) {
          this.$emit('blur', this.quill)
        } else {
          this.$emit('focus', this.quill)
        }
      })

      this.quill.on('text-change', () => {
        let html = this.$refs.editor.children[0].innerHTML
        const quill = this.quill
        const text = this.quill.getText()
        if (html === '<p><br></p>') html = ''
        this.content = html
        this.$emit('input', html)
        this.$emit('change', { html, text, quill })
      })
    },
  },
}
</script>

<style lang="scss">
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
