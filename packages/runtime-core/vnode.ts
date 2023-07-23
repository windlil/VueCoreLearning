import { isObject } from "packages/shared"
import { ShapeFlags } from "packages/shared/ShapeFlags"

export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    shapeFlags: getFlags(type),
    el: null
  }

  if (typeof children === 'string') {
    vnode.shapeFlags |= ShapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) (
    vnode.shapeFlags |= ShapeFlags.ARRAY_CHILDREN
  )

  if (vnode.shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof vnode.children === 'object') {
      vnode.shapeFlags |= ShapeFlags.SLOTS_CHILDREN
    }
  }

  return vnode
}

function getFlags(type) {
  if (typeof type === 'string') {
    return ShapeFlags.ELEMENT
  } else if (isObject(type)) {
    return ShapeFlags.STATEFUL_COMPONENT
  }
  return 0
}

export function createTextContent(text: string) {
  return createVNode('Text',{}, text)
}