import { handlerKey, camelize } from "../shared/index"

export function emit(instance, event, ...args) {
  const props = instance.vnode.props
  


  const handleName = handlerKey(camelize(event))

  const handler = props[handleName as any]

  handler && handler(...args)
}