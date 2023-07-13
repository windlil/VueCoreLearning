import { extend, hasChanged, hasOwn, isArray, isIntegerKey, isObject } from "@vue/shared"
import { readonly, reactive } from "./reactive"
import { track, trigger } from "./effect"
import { TrackOTypes, TriggerOTypes } from "./operators"

function createSetter() {
  return function set(target:any, key:any, value:any, receiver:any) {
    const oldValue = target[key]
    const result = Reflect.set(target, key, value, receiver)
    let hadKey = isArray(target) && isIntegerKey(value)
    ? Number(key) < target.length
    :hasOwn(target,key)
    if (!hadKey) {
      //add
      trigger(target,TriggerOTypes.ADD, key, value)
    } else if(hasChanged(oldValue, value)) {
      //set
      trigger(target,TriggerOTypes.SET, key, value)
    }

    return result
  }
}

function createReadonlySetter() {
  return function set(target:any, key:any) {
    console.warn(`${target} on ${key} can't be modify`)
  }
}

function createGettter(isShallow:boolean = false, isReadonly:boolean = false) {
  return function get(target:any, key:any, receiver:any) {
    const res = Reflect.get(target,key,receiver)
    if (!isReadonly) {
      track(target,TrackOTypes.GET,key)
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

const readOnlyGetter = {
  set:createReadonlySetter()
}

const get = createGettter()
const shallowGet = createGettter(true, false)
const readonlyGet = createGettter(false, true)
const shallowReadonlyGet = createGettter(true, true)

const setSetter = createSetter()

export const mutableHandlers = {
  get,
  set:setSetter
}

export const shallowHandlers = {
  get:shallowGet,
  set:setSetter
}

export const readonlyHandlers = extend({
  get: readonlyGet
}, readOnlyGetter)

export const shallowReadonlyHandlers = extend({
  shallowReadonlyGet: shallowReadonlyGet
}, readOnlyGetter)