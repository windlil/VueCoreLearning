import {
  reactiveHandler,
  readonlyHandler,
  shallowReadonlyHandler
} from './baseHandlers'
import { isObject } from '../../shared/index'

export const reactiveProxyMap = new WeakMap()
export const readonlyProxyMap = new WeakMap()
export const shallowReadonlyProxyMap = new WeakMap()

export function reactive(target) {
  return createReactiveObject(target, reactiveProxyMap, reactiveHandler)
}

export function readonly(target) {
  return createReactiveObject(target, readonlyProxyMap, readonlyHandler)
}

export function shallowReadonly(target) {
  return createReactiveObject(target, shallowReadonlyProxyMap, shallowReadonlyHandler)
}

function createReactiveObject(target, proxyMap, baseHandlers) {
  if (!isObject(target)) return target
  const existingProxy = proxyMap.get(target)
  
  if (existingProxy) return existingProxy

  const proxy = new Proxy(target, baseHandlers)
  proxyMap.set(target, proxy)

  return proxy
}