import { isTracking, trackEffect, triggerEffect } from './effect'

class RefImpl {
  private _value:any
  private dep
  constructor(value) {
    this._value = value
    this.dep = new Set()
  }
  get value() {
    if (isTracking()) {
      trackEffect(this.dep)
    }
    return this._value
  }
  set value(newValue) {
    this._value = newValue
    triggerEffect(this.dep)
  }
}

export function ref(value) {
  return new RefImpl(value)
}