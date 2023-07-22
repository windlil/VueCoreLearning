import { hasOwn } from "packages/shared"

const publicPropertiesMap = {
  $el: (i) => i.vnode.el
}


//componet instance handler
export const publicInstanceHandler = {
  get({_: instance}, key) {
    const { setupResult, props } = instance
    
    
    if (hasOwn(setupResult, key)) {
      return setupResult[key]
    } else if (hasOwn(props, key)) {
      return props[key]
    }

    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) { 
      return publicGetter(instance)
    }
  }
}