let activeEffect

class ReactiveEffect {
  private _fn: any
  constructor(fn) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    this._fn()
  }
}

export function effect(fn) {
  const _effect =  new ReactiveEffect(fn)
  _effect.run()
}

const targetMap = new WeakMap()

export function track(target, key) {
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  } 

  let deps = depsMap.get(key)

  if (!deps) {
    deps = new Set()
    depsMap.set(key, deps)
  }

  deps.add(activeEffect)
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target)

  if (!depsMap) {
    return
  }

  const effects = depsMap.get(key)

  for (const e of effects) {
    e.run()
  }
}