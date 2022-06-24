// import Vue from 'vue'
const isServer = /* Vue.prototype.$isServer */ false;
const ieVersion = isServer ? 0 : Number(document.documentMode);

/**
 * 滚动到目标DOM位置上
 * @param { Element } container 滚动的容器
 * @param { Element } selected 滚动到的目标DOM
 */
export const scrollIntoView = function (container, selected) {
    if (Vue.prototype.$isServer) return;

    if (!selected) {
        container.scrollTop = 0;
        return;
    }

    const offsetParents = [];
    let pointer = selected.offsetParent;
    while (pointer && container !== pointer && container.contains(pointer)) {
        offsetParents.push(pointer);
        pointer = pointer.offsetParent;
    }
    const top =
        selected.offsetTop +
        offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0);
    const bottom = top + selected.offsetHeight;
    const viewRectTop = container.scrollTop;
    const viewRectBottom = viewRectTop + container.clientHeight;

    if (top < viewRectTop) {
        container.scrollTop = top;
    } else if (bottom > viewRectBottom) {
        container.scrollTop = bottom - container.clientHeight;
    }
};

/* istanbul ignore next */
export const on = (function () {
    if (!isServer && document.addEventListener) {
        return function (element, event, handler) {
            if (element && event && handler) {
                element.addEventListener(event, handler, false);
            }
        };
    } else {
        return function (element, event, handler) {
            if (element && event && handler) {
                element.attachEvent("on" + event, handler);
            }
        };
    }
})();

/* istanbul ignore next */
export const off = (function () {
    if (!isServer && document.removeEventListener) {
        return function (element, event, handler) {
            if (element && event) {
                element.removeEventListener(event, handler, false);
            }
        };
    } else {
        return function (element, event, handler) {
            if (element && event) {
                element.detachEvent("on" + event, handler);
            }
        };
    }
})();

/* istanbul ignore next */
export const once = function (el, event, fn) {
    var listener = function () {
        if (fn) {
            fn.apply(this, arguments);
        }
        off(el, event, listener);
    };
    on(el, event, listener);
};

/**
 * 判断是目标DOM是否可以滚动
 * @param { Element | Any } el 目标Dom
 * @param { Boolean } vertical 是否是垂直方向
 * @return { Boolean }
 */
export const isScroll = (el, vertical) => {
    if (isServer) return;

    const determinedDirection = vertical !== null || vertical !== undefined;
    const overflow = determinedDirection
        ? vertical
            ? getStyle(el, "overflow-y")
            : getStyle(el, "overflow-x")
        : getStyle(el, "overflow");

    return overflow.match(/(scroll|auto)/);
};

/**
 * 获取目标DOM滚动的容器
 * @param { Element } el
 * @param { Boolean } vertical
 * @return { Element | Window }
 */
export const getScrollContainer = (el, vertical) => {
    if (isServer) return;

    let parent = el;
    while (parent) {
        if ([window, document, document.documentElement].includes(parent)) {
            return window;
        }
        if (isScroll(parent, vertical)) {
            return parent;
        }
        parent = parent.parentNode;
    }

    return parent;
};

/**
 * 设置光标位置
 * @param { Element } el 目标DOM
 * @param { Number } position 位置值
 */
export const setCursor = function (el, position) {
    let setSelectionRange = function () {
        el.setSelectionRange(position, position);
    };
    if (el === document.activeElement) {
        setSelectionRange();
        setTimeout(setSelectionRange, 1); // Android Fix
    }
};

/**
 * 自定义下载
 */
export function download(href, name = `download.xlsx`) {
    let eleLink = document.createElement("a");
    eleLink.download = name;
    eleLink.href = href;
    eleLink.click();
}

/**
 * 判断目标对象是否为dom对象
 * @param { Any } obj
 * @return { Boolean }
 */
export function isDOM(obj) {
    if (typeof HTMLElement === "object") {
        return obj instanceof HTMLElement;
    }
    return (
        obj &&
        typeof obj === "object" &&
        obj.nodeType === 1 &&
        typeof obj.nodeName === "string"
    );
}

/**
 * 判断是否为虚拟节点
 * @param { Any } node 目标对象
 * @return { Boolean }
 */
export const isVNode = function (node) {
    return (
        node !== null &&
        typeof node === "object" &&
        Object.prototype.hasOwnProperty.call(node, "componentOptions")
    );
};

/**
 * 获取字符长度
 * @param {string} str
 * @returns {number}
 */
export function byteLengthEn(str) {
    if (typeof str !== "string") return;
    let b = 0;
    for (let i = str.length - 1; i >= 0; i--) {
        if (str.charCodeAt(i) > 255) {
            b += 2;
        } else {
            b++;
        }
    }
    return b;
}

/**
 * 上移下移动画特效
 * @param {Element} rect 当前移动的元素
 * @param {Element} toRect 目标元素
 * @param {Number} translate 移动索引, 当前元素和目标元素在数组中的索引
 * @param {Function<any>} callback 动画结束回调
 */
export function animate(rect, toRect, translate, callback) {
    const { top: rectTop, bottom: reactBottom } = rect.getBoundingClientRect();
    const { top: toRectTop, bottom: toReactBottom } =
        toRect.getBoundingClientRect();
    const y1 = toReactBottom - reactBottom;
    const y2 = toRectTop - rectTop;
    const transitionend = () => {
        rect.style.transition = "";
        toRect.style.transition = "";
        rect.style.transform = "";
        toRect.style.transform = "";
        callback();
        rect.removeEventListener("transitionend", transitionend);
    };
    rect.style.transform = `translateY(0)`;
    rect.style.transition = `all .3s ease-in-out`;
    toRect.style.transform = `translateY(0)`;
    toRect.style.transition = `all .3s ease-in-out`;
    rect.style.transform = `translateY(${translate > 0 ? y1 : y2}px)`;
    toRect.style.transform = `translateY(${translate > 0 ? -y2 : -y1}px)`;
    rect.addEventListener("transitionend", transitionend);
}
