import { ShapeFlags } from "../shared/ShapeFlags"

export function initSlots(instance, children) {
  if (instance.vnode.shapeFlags & ShapeFlags.SLOTS_CHILDREN) {
    const slots = {}

    for (const key in children) {
      const value = children[key]
      slots[key] = (props) => normalizeSlotValue(value(props))
    }

    instance.slots = slots
  }
}

function normalizeSlotValue(value) {
  return Array.isArray(value)? value: [value]
}