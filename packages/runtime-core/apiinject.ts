import { getCurrentInstance } from "./component";

export function provide(key, value) {
  const instance = getCurrentInstance()

  if (instance) {
    const { provides } = instance
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