/* eslint-disable */
import Vue from "vue";
// import once from "lodash/once";

const map = new WeakMap();
const Deep = { target: null };

// const createWatchs = (target, inputs, vm, update) => {
//   const callbackId = `callback_${target.uid}`;
//   let watchs = target.callbacks[callbackId];
//   if (watchs == null) {
//     watchs = target.callbacks[callbackId] = once(() =>
//       inputs.forEach((ob) => {
//         vm.$watch(() => ob.visible, update);
//       })
//     );
//   }
//   return watchs;
// };

// const createHook = (hookName, target, vm, callback) => {
//   let emitFn = target.effects[`emit_${target.uid}`];
//   const hookTag = `hook:${hookName}`;

//   if (emitFn == null) {
//     emitFn = target.effects[target.uid] = () => {
//       vm.$off(hookTag, callback);
//       vm.$on(hookTag, callback);
//     };
//   }
//   emitFn();
// };

// 不同的返回true
const diffDeps = (deps, target) => {
  const depsId = `deps_${target.uid}`;
  if (deps.length === 0) return false;

  let preDepsStates = target.callbacks[depsId];
  if (preDepsStates == null) {
    target.callbacks[depsId] = deps;
    return true;
  }
  const ret =
    preDepsStates.length === deps.length &&
    preDepsStates.every((o, i) => deps[i] === o);
  target.callbacks[depsId] = deps;
  return !ret;
};

export const useState = (defaultVisible) => {
  const target = map.get(Deep.target);
  let state = target.states[target.uid];
  if (state == null) {
    state = target.states[target.uid] = Vue.observable({
      visible: !!defaultVisible,
      setVisible(visible) {
        state.visible = visible;
      },
    });
  }
  target.uid++;
  return [state.visible, state.setVisible];
};

export const useCallback = (callback, deps) => {
  if (deps == null) return callback;

  const target = map.get(Deep.target);
  const { callbacks } = target;

  // 依赖发生变化直接返回
  if (deps && diffDeps(deps, target)) return callback;

  let ret = callbacks[target.uid];
  if (ret == null) {
    ret = callback;
    callbacks[target.uid] = ret;
  }

  target.uid++;
  return ret;
};

const globalMixin = {
  created() {
    Deep.target = this;
    map.set(this, {
      states: {},
      callbacks: {},
      effects: {},
      uid: 0,
    });
  },
  beforeUpdate() {
    Deep.target = this;
    map.get(this).uid = 0;
  },
};

Vue.mixin(globalMixin);
