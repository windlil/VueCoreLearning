import { isObject } from "packages/shared"
import { reactive, readonly } from "./reactive"


function createGetter(isReadonly = false, isShallow = false) {
  return function(target, key, receiver) {
    const res = Reflect.get(target, key, receiver)

    if (!isReadonly) {
      //trigger
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

const get = createGetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

const reactiveHandler = {

}

const readonlyHandler = {
  
}

const shallowReadonlyHandler = {
  
}

export {
  reactiveHandler,
  readonlyHandler,
  shallowReadonlyHandler
}