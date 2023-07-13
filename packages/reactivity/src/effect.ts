import { isArray, isIntegerKey } from "@vue/shared"
import { TriggerOTypes } from "./operators"

export function effect(fn:any,options:any = {}) {
  const effect = createReactiveEffect(fn, options)

  if (!options.lazy) {
    effect()
  }
}

let uid = 0

let activeEffect:any
const effectStack:any[] = []
function createReactiveEffect(fn:any, options:any) {
  const effect = function effect() {
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect)
        activeEffect = effect
        return fn()
      } 
      finally {
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  }
  effect.uid = uid++
  effect._effect = true
  effect.raw = fn
  effect.options = options
  return effect
}

const targetMap = new WeakMap()
export function track(target:any, type:any, key:string) {
  if (!activeEffect) {
    return
  }
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target,(depsMap = new Map))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set))
  }
  if (!deps.has(activeEffect)) {
    deps.add(activeEffect)
  }
}


export function trigger(target:any, type:any, key:any, value:any) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const effects = new Set()
  const add = (effectsToAdd:any) => {
    if (effectsToAdd) {
      effectsToAdd.forEach((effect:any) => {
        effects.add(effect)
      })
    }
  }
  if ( key === 'length' && isArray(target)) {
      add(depsMap.get(key))
  } else {
    if (key !== undefined) {
      add(depsMap.get(key))
    }

    switch(type) {
      case TriggerOTypes.ADD:
        if (isArray(target) && isIntegerKey(key)) {
          add(depsMap.get('length'))
        }
    }
  }
  effects.forEach((effect:any) => {
    effect()
  })
}