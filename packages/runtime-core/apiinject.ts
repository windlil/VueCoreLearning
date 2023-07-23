import { getCurrentInstance } from "./component";

export function provide(key, value) {
  const instance = getCurrentInstance()

  if (instance) {
    let { provides } = instance
    const parentProvides = instance.parent.provides

    if (provides === parentProvides) {
      provides = instance.parent.provides = Object.create(parentProvides)
    }
    provides[key] =value
  }
}

export function inject(key) {
  const instance = getCurrentInstance()

  if (instance) {
    const parentProvides = instance.parent.provides
    return parentProvides[key]
  }
}