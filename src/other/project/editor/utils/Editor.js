import Base64 from './base64'

function cloneRegExp(regExp) {
  return new RegExp(regExp.source, regExp.flags)
}
const Editor = {
  regs: {
    tree: new RegExp('\\<\\!--\\s*@protocol:(?<section>.*):start\\s*--\\>(?<content>[\\s\\S]*?)\\<\\!--\\s*@protocol:\\k<section>:end\\s*--\\>', 'g'),
    body: new RegExp('\\<body.*\\>(?<body>[\\s\\S]*?)<\\/body\\>', 'g'),
    head: new RegExp('\\<head.*\\>(?<head>[\\s\\S]*?)<\\/head\\>', 'g'),
  },
  getEnv() {
    return (
      (/^(127.0.0.1)|(192.168)|(localhost)|(localdev)|(dev)/.test(window.location.hostname))
        ? 'localdev'
        : 'production'
    )
  },
  pathJoin(...rest) {
    const parths = rest.filter(o => typeof o === 'string' && o.length > 0).join('/')
    return parths
      // '//' '/./' => '/'
      .replace(/((?<!\:)\/(\/)+)|(\/+\.\/+)/g, '/')
      // '/*/../' => '/'
      .replace(/\/[^\/]*?\/\.\.\//g, '/')
  },
  parseBase64ToHtml(content) {
    // return window.atob(content)
    if (typeof content !== 'string') return ''
    return Base64.decode(content)
  },
  parseBody(content) {
    const ret = this.cloneRegExp(this.regs.body).exec(content)?.groups?.body
    if (ret == null) {
      console.error(`<<< 解析body标签失败. content:`, content)
      return ''
    }
    return ret
  },
  parseHead(content, path = '') {
    let ret = /\<head.*\>(?<head>[\s\S]*?)<\/head\>/.exec(content)?.groups?.head
    if (ret == null) {
      console.error(`<<< 解析head标签失败. content:`, content)
      return ''
    }
    const origin = window.location.protocol + (this.getEnv() === 'localdev' ? '//localdev.h5xy.uheixia.com' : '//h5xy.uheixia.com')
    ret = ret
      .replace(/(?<=((href)|(src))=\")([^\"]*)/g, (source) => {
        if (/^\//.test(source)) {
          return this.pathJoin(origin, source)
        } else if (/^\./.test(source)) {
          return this.pathJoin(origin, path, source)
        }
        return source
      })
      // .replace(/\"\.*?(\/public\/)/g, `\"${origin}$1`)
      // .replace(/\"\.(\/css\/)/g, `\"${origin}/${path}$1`)
    return ret
  },
  cloneRegExp,
  structure(content, regExp) {
    const target = []
    const r = this.cloneRegExp(regExp || this.regs.tree)
    // const r = /\<\!--\s*@protocol:(?<section>.*):start\s*--\>(?<content>[\s\S]*?)\<\!--\s*@protocol:\k<section>:end\s*--\>/g
    let t
    while ((t = r.exec(content))) {
      const _t = {
        source: t.groups.content,
        content: t.groups.content,
        section: t.groups.section,
        children: this.structure(t.groups.content),
        lastIndex: r.lastIndex,
      }
      t.groups && target.push(_t)
    }
    return target
  },
  replaceSection(body, target, val) {
    const content = `<div class="ql-container ql-snow">
      <div class="ql-editor">${val}</div>
    </div>`
    return body.replace(
      new RegExp(`(\\<\\!--\\s*@protocol:${target.section}:start\\s*--\\>)[\\s\\S]*?(\\<\\!--\\s*@protocol:${target.section}:end\\s*--\\>)`),
      `$1${content}$2`
    )
  },
  structureObj(content, regExp) {
    const target = {}
    const r = this.cloneRegExp(regExp || this.regs.tree)
    let t
    while ((t = r.exec(content))) {
      const _t = {
        source: t.groups.content,
        content: t.groups.content,
        section: t.groups.section,
        children: this.structure(t.groups.content),
        lastIndex: r.lastIndex,
      }
      t.groups && (target[_t.section] = _t)
    }
    return target
  },
}

export default Editor
