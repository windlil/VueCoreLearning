import { render } from "./render"
import { createVNode } from "./vnode"

export function createApp(rootCompnent) {
  const app = {
    mount(rootContainer: any) {
      const vnode = createVNode(rootCompnent)

      render(vnode, rootContainer)
    }
  }
  return app
}