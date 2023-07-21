import { hasChanged } from "../shared/index"
import { ReactiveEffect } from "./effect"

class ComputedRefImpl {
  private _getter
  private _isDirty = true
  private _value
  private _effect
  constructor(getter) {
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._isDirty) {
        this._isDirty = true
      }
    })
  }
  get value() {
    if (this._isDirty) {
      this._isDirty = false
      this._value = this._effect.run()
    }
    return this._value
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter)
}