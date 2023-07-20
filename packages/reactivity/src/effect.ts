import { extend } from '../../shared/index'

let activeEffect

class ReactiveEffect {
  private _fn: any
  private active = true
  deps = []
  onStop?: () => void

  constructor(fn, public scheduler?) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    const res = this._fn()
    return res
  }

  stop() {
    if (this.active) {
      cleanUpEffect(this)
      this.active = false
      if (this.onStop) this.onStop()
    }
  }
}

function cleanUpEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
}

const targetMap = new WeakMap()

export function track(target, key) {
  if (!activeEffect) return

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
  activeEffect.deps.push(deps)
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target)

  if (!depsMap) {
    return
  }

  const effects = depsMap.get(key)
  
  for (const e of effects) {
    if (e.scheduler) {
      e.scheduler()
    } else {
      e.run()
    }
  }
}

export function effect(fn, options: any = {}) {
  const _effect =  new ReactiveEffect(fn, options.scheduler)
  extend(_effect, options)
  _effect.run()
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export function stop(runner) {
  runner.effect.stop()
}