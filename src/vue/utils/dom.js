import Vue from 'vue'

const ieVersion = isServer ? 0 : Number(document.documentMode);

export default function scrollIntoView(container, selected) {
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
}

/* istanbul ignore next */
export const on = (function() {
    if (!isServer && document.addEventListener) {
        return function(element, event, handler) {
            if (element && event && handler) {
                element.addEventListener(event, handler, false);
            }
        };
    } else {
        return function(element, event, handler) {
            if (element && event && handler) {
                element.attachEvent("on" + event, handler);
            }
        };
    }
})();

/* istanbul ignore next */
export const off = (function() {
    if (!isServer && document.removeEventListener) {
        return function(element, event, handler) {
            if (element && event) {
                element.removeEventListener(event, handler, false);
            }
        };
    } else {
        return function(element, event, handler) {
            if (element && event) {
                element.detachEvent("on" + event, handler);
            }
        };
    }
})();

/* istanbul ignore next */
export const once = function(el, event, fn) {
    var listener = function() {
        if (fn) {
            fn.apply(this, arguments);
        }
        off(el, event, listener);
    };
    on(el, event, listener);
};

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
