import { render } from "./render"
import { createVNode } from "./vnode"

export function createApp(rootContainer) {
  const app = {
    mount(rootContainer) {
      const vnode = createVNode(rootContainer)

      render(vnode, rootContainer)
    }
  }
  return app
}