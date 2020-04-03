/**
 * navigationStart： 含义为：同一个浏览器上一个页面卸载结束时的时间戳。如果没有上一个页面的话，那么该值会和fetchStart的值相同。
redirectStart: 该值的含义是第一个http重定向开始的时间戳，如果没有重定向，或者重定向到一个不同源的话，那么该值返回为0.
redirectEnd: 最后一个HTTP重定向完成时的时间戳。如果没有重定向，或者重定向到一个不同的源，该值也返回为0.
fetchStart: 浏览器准备好使用http请求抓取文档的时间(发生在检查本地缓存之前)。
domainLookupStart: DNS域名查询开始的时间，如果使用了本地缓存话，或 持久链接，该值则与fetchStart值相同。
domainLookupEnd: DNS域名查询完成的时间，如果使用了本地缓存话，或 持久链接，该值则与fetchStart值相同。
connectStart: HTTP 开始建立连接的时间，如果是持久链接的话，该值则和fetchStart值相同，如果在传输层发生了错误且需要重新建立连接的话，那么在这里显示的是新建立的链接开始时间。
secureConnectionStart: HTTPS 连接开始的时间，如果不是安全连接，则值为 0
connectEnd：HTTP完成建立连接的时间(完成握手)。如果是持久链接的话，该值则和fetchStart值相同，如果在传输层发生了错误且需要重新建立连接的话，那么在这里显示的是新建立的链接完成时间。
requestStart: http请求读取真实文档开始的时间，包括从本地读取缓存，链接错误重连时。
responseStart: 开始接收到响应的时间(获取到第一个字节的那个时候)。包括从本地读取缓存。
responseEnd： HTTP响应全部接收完成时的时间(获取到最后一个字节)。包括从本地读取缓存。
unloadEventStart: 前一个网页（和当前页面同域）unload的时间戳，如果没有前一个网页或前一个网页是不同的域的话，那么该值为0.
unloadEventEnd: 和 unloadEventStart 相对应，返回是前一个网页unload事件绑定的回调函数执行完毕的时间戳。
domLoading: 开始解析渲染DOM树的时间。
domInteractive: 完成解析DOM树的时间（只是DOM树解析完成，但是并没有开始加载网页的资源）。
domContentLoadedEventStart：DOM解析完成后，网页内资源加载开始的时间。
domContentLoadedEventEnd: DOM解析完成后，网页内资源加载完成的时间。
domComplete: DOM树解析完成，且资源也准备就绪的时间。Document.readyState 变为 complete，并将抛出 readystatechange 相关事件。
loadEventStart: load事件发送给文档。也即load回调函数开始执行的时间，如果没有绑定load事件，则该值为0.
loadEventEnd: load事件的回调函数执行完毕的时间，如果没有绑定load事件，该值为0.
 */
export function getPerformanceTiming() {
    var performance = window.performance || window.msPerformance || window.webkitPerformance;
    if (!performance) {
      console.log('您的浏览器不支持performance属性');
      return;
    }
    var t = performance.timing;
    var obj = {
      timing: performance.timing
    };
    setTimeout(() => {
      // 页面加载完成的时间
      // 【原因】这几乎代表了用户等待页面可用的时间
      obj.loadPage = t.loadEventEnd - t.navigationStart;
      // 解析 DOM 树结构的时间
      // 【原因】反省下你的 DOM 树嵌套是不是太多了！
      obj.domReady = t.domComplete - t.responseEnd;
      // 重定向的时间
      // 【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
      obj.redirect = t.redirectEnd - t.redirectStart;
      // DNS 查询时间
      // 【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
      // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)
      obj.lookupDomain = t.domainLookupEnd - t.domainLookupStart;
      // 读取页面第一个字节的时间
      // 【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
      // TTFB 即 Time To First Byte 的意思
      // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
      obj.ttfb = t.responseStart - t.navigationStart;
      // 内容加载完成的时间
      // 【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
      obj.request = t.responseEnd - t.requestStart;
      // 执行 onload 回调函数的时间
      // 【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
      obj.loadEvent = t.loadEventEnd - t.loadEventStart;
      // DNS 缓存时间
      obj.appcache = t.domainLookupStart - t.fetchStart;
      // 卸载页面的时间
      obj.unloadEvent = t.unloadEventEnd - t.unloadEventStart;
      // TCP 建立连接完成握手的时间
      obj.connect = t.connectEnd - t.connectStart;
    }, 2000);
    return obj;
  }
