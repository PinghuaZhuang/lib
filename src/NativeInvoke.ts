console.log(1)
interface AnyI {
  [prop: string]: any;
}
interface B {
  [prop: string]: string[]
}

const queueInvoke = Symbol('queueInvoke')
const async = Symbol('async')
const sync = Symbol('sync')

// LOGS


const createQueueHandler = (name: string) => {
  const callbacks: string[] = []
  // TODO: 判断是否有
  ;(createQueueHandler as B) [name] = callbacks

  return {
    [queueInvoke]: callbacks,
    [async]: () => {
      return new Promise((resolve, reject) => {

      })
    },
    [sync]: () => {

    },
  }
}


function gn() {
}
gn.name = 'xxx'

// const noop = () => { return  }
const NativeInvokeName = 'NE'

const NativeInvoke: AnyI = new Proxy({
  NativeInvokeName,
  setName,
}, {
  get(a: any, b: any, c: any) {
    // 没一个回调使用一个 callback ? 还是全局统一一个?
    return () => {
      return createQueueHandler()
    }
  },
  apply(a, b, c) {
    // switch () {
    //   case 'async':
    //     break;
    //   case 'sync':

    //     break;
    //   case '':
    //     break;

    //   default:
    //     throw `NativeInvoke error. ${b}`
    //     break;
    // }
  },
})

NativeInvoke.post()

export default NativeInvoke
