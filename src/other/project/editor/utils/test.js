var str =
  '<!\\x2D\\x2D[\\t-\\r \\xA0\\u1680\\u2000-\\u200A\\u2028\\u2029\\u202F\\u205F\\u3000\\uFEFF]*@protocol:(.*):start[\\t-\\r \\xA0\\u1680\\u2000-\\u200A\\u2028\\u2029\\u202F\\u205F\\u3000\\uFEFF]*\\x2D\\x2D>([\\0-\\uFFFF]*?)<!\\x2D\\x2D[\\t-\\r \\xA0\\u1680\\u2000-\\u200A\\u2028\\u2029\\u202F\\u205F\\u3000\\uFEFF]*@protocol:\\1:end[\\t-\\r \\xA0\\u1680\\u2000-\\u200A\\u2028\\u2029\\u202F\\u205F\\u3000\\uFEFF]*\\x2D\\x2D>'

var a = str.replace(/\\[xu]([0-9A-F]{2,4})/g, (a, b) => {
  console.log('aaaa', a, b, a.charAt(1) === 'x'
  ? String.fromCharCode(Number.parseInt(a.replace(/\\/g, 0)))
  : unescape(a.replace(/\\/g, '%')))
  return a.charAt(1) === 'x'
    ? String.fromCharCode(Number.parseInt(a.replace(/\\/g, 0)))
    : unescape(a.replace(/\\/g, '%'))
})

console.log('a', a)
