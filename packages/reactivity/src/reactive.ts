import {
  mutableHandlers,
  shallowHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers
} from './baseHandlers'
import { isObject } from '@vue/shared'

const reactiveMap = new WeakMap()
const shallowMap = new WeakMap()

function createReactiveObject(target:object, readonly:boolean = false, baseHandlers:object) {
  if (!isObject(target)) {
    return target
  }
  const proxyMap = readonly? shallowMap: reactiveMap

  const existProxy = proxyMap.get(target)
  if (existProxy) {
    return existProxy
  }
  const p = new Proxy(target, baseHandlers)
  proxyMap.set(target, p)
  return p
}

export function reactive(target:object) {
  return createReactiveObject(target, false, mutableHandlers)
}

export function shallowReactive(target:object) {
  return createReactiveObject(target, false, shallowHandlers)
}

export function readonly(target:object) {
  return createReactiveObject(target, true, readonlyHandlers)
}

export function shallowReadonly(target:object) {
  return createReactiveObject(target, true, shallowReadonlyHandlers)
}