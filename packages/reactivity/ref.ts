import { isTracking, trackEffect, triggerEffect } from './effect'
import { hasChanged, isObject } from '../shared/index'
import { reactive } from './reactive'

class RefImpl {
  private _value: any
  private dep
  private _raw
  public __is_ref = true
  constructor(value) {
    this._raw = value
    this._value = isObject(value) ? reactive(value) : value
    this.dep = new Set()
  }
  get value() {
    if (isTracking()) {
      trackEffect(this.dep)
    }
    return this._value
  }
  set value(newValue) {
    if (!hasChanged(newValue, this._raw)) return
    this._value = isObject(newValue) ? reactive(newValue) : newValue
    this._raw = newValue
    triggerEffect(this.dep)
  }
}

export function ref(value) {
  return new RefImpl(value)
}

export function isRef(ref) {
  return ref.__is_ref ?? false
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}

export function proxyRefs(obj) {
  return new Proxy(obj, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    },
    set(target, key, newValue) {
      if (isRef(target[key] && !isRef(newValue))) {
        return target[key].value = newValue
      } else {
        return Reflect.set(target, key, newValue)
      }
    }
  })
}