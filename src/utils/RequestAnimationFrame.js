// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

;(function (global) {
	var lastTime = 0
	var vendors = ['ms', 'moz', 'webkit', 'o']
	for (var x = 0; x < vendors.length && !global.requestAnimationFrame; ++x) {
		global.requestAnimationFrame = global[vendors[x] + 'RequestAnimationFrame']
		global.cancelAnimationFrame =
			global[vendors[x] + 'CancelAnimationFrame'] || global[vendors[x] + 'CancelRequestAnimationFrame']
	}

	if (!global.requestAnimationFrame)
		global.requestAnimationFrame = function (callback, element) {
			var currTime = new Date().getTime()
			var timeToCall = Math.max(0, 16 - (currTime - lastTime))
			var id = global.setTimeout(function () {
				callback(currTime + timeToCall)
			}, timeToCall)
			lastTime = currTime + timeToCall
			return id
		}

	if (!global.cancelAnimationFrame)
		global.cancelAnimationFrame = function (id) {
			clearTimeout(id)
		}
})(target || this)
