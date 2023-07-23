
import { createComponentInstance, setupComponent } from "./component"
import { ShapeFlags } from "packages/shared/ShapeFlags"

export function render(vnode, container, parent) {
  patch(vnode, container, parent)
}

function patch(vnode, container, parnet) {
  const { shapeFlags, type } = vnode

  switch(type) {
    case "Fragment":
      processFragment(vnode, container, parnet)
      break
    default:
      if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container, parnet)
      } else if (shapeFlags & ShapeFlags.ELEMENT) {
        processElement(vnode, container, parnet)
      }
  }
}

function processFragment(vnode, container, parent) {
  mountChildren(vnode.children, container, parent)
}

function processElement(vnode: any, container: any, parent: any) {
  mountElement(vnode, container, parent)
}

function mountElement(vnode, container, parent)  {
  const el:HTMLElement = vnode.el = document.createElement(vnode.type)
  const { children, shapeFlags } = vnode

  if (shapeFlags & ShapeFlags.TEXT_CHILDREN)  {
    el.textContent = children
  } else if(shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(children, el, parent)
  }

  const { props } = vnode
  for (const item in props) {
    const isEvent = item.slice(0, 2) === 'on'
    if (isEvent) {
      const event = item.slice(2).toLowerCase()
      el.addEventListener(event, props[item])
    } else {
      el.setAttribute(item, props[item])
    }
  }

  container.append(el)
}

function mountChildren(children, container, parent)  {
  for (const vnode of children)  {
    patch(vnode, container, parent)
  }
}

function processComponent(vnode: any, container: any, parnet: any) {
  mountComponent(vnode, container, parnet)
}

function mountComponent(initialVNode: any, container: any, parent: any) {
  const instance = createComponentInstance(initialVNode, parent)
  setupComponent(instance)
  setupRenderEffect(instance,initialVNode, container)
}

function setupRenderEffect(instance,initialVNode, container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)
  patch(subTree, container, instance)
  initialVNode.el = subTree.el
}

