import { isObject } from "../../shared/index"
import { ReactiveFlages, reactive, readonly } from "./reactive"
import { track, trigger } from './effect'


function createGetter(isReadonly = false, isShallow = false) {
  return function(target, key, receiver) {
    if (key === ReactiveFlages.IS_REACTIVE) {
      return !isReadonly 
    } else if (key === ReactiveFlages.IS_READONLY) {
      return isReadonly
    }

    const res = Reflect.get(target, key, receiver)

    if (!isReadonly) {
      //trigger
      track(target, key)
    }

    if (isShallow) {
      return res
    }

    if (isObject(res)) {
      return isReadonly? readonly(res): reactive(res)
    }

    return res

  }
}

function createSetter() {
  return function(target, key, newValue, receiver) {
    const res = Reflect.set(target, key, newValue, receiver)
    trigger(target, key)
    return res
  }
}

const set = createSetter()

const get = createGetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

const reactiveHandler = {
  get,
  set
}

const readonlyHandler = {
  get: readonlyGet,
  set(target, key) {
    // readonly 的响应式对象不可以修改值
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    );
    return true;
  },
}

const shallowReadonlyHandler = {
  get: shallowReadonlyGet,
  set(target, key) {
    // readonly 的响应式对象不可以修改值
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    );
    return true;
  },
}

export {
  reactiveHandler,
  readonlyHandler,
  shallowReadonlyHandler
}