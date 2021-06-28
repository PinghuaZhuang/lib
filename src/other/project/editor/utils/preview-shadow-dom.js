/**
 * @file element-ui 提示框提示用户
 */
import once from 'lodash/once'

function createTemplate(head) {
  const template = document.createElement('template')
  template.innerHTML = (head || '') + `<slot name="default">`
  return template
}

function _register() {
  class EditorPreview extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }

    static get observedAttributes() {
      return ['data-dangerhtml', 'data-head']
    }

    init(head) {
      if (!head || this.shadowRoot.childElementCount > 1) return
      this.template = createTemplate(head)
      this.shadowRoot.appendChild(
        this.template.content.cloneNode(true)
      )
    }

    update(html = '') {
      const slotsDefault = this.shadowRoot.querySelectorAll('slot[name="default"]')[0]

      if (slotsDefault == null) {
        return console.error('<<< ne-message slot default error.')
      }

      slotsDefault.innerHTML = html
    }
  }

  customElements.define('ne-editor-preview', EditorPreview)
}

export const register = once(_register)

register()
