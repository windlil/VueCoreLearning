import { extend } from '../../shared/index'

let activeEffect
let shouldTrack

class ReactiveEffect {
  private _fn: any
  private active = true
  deps = []
  onStop?: () => void

  constructor(fn, public scheduler?) {
    this._fn = fn
  }

  run() {
    //当执行stop后 不应该再次去收集effect 因此不能走下面的过程
    if (!this.active) {
      return this._fn()
    }
    //防止重复track
    shouldTrack = true

    activeEffect = this
    const res = this._fn()

    shouldTrack = false;
    activeEffect = undefined
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

export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function track(target, key) {
  if (!isTracking()) return

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

  trackEffect(deps)
}

export function trackEffect(dep) {
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target)

  if (!depsMap) {
    return
  }

  const effects = depsMap.get(key)
  
  triggerEffect(effects)
}

export function triggerEffect(dep) {  
  for (const e of dep) {
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