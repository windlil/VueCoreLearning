import { isObject } from "packages/shared"
import { createComponentInstance, setupComponent } from "./component"
import { ShapeFlags } from "packages/shared/ShapeFlags"

export function render(vnode, container) {
  patch(vnode, container)
}

function patch(vnode, container) {
  const { shapeFlags } = vnode

  if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container)
  } else if (shapeFlags & ShapeFlags.ELEMENT) {
    processElement(vnode, container)
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container)
}

function mountElement(vnode, container)  {
  const el:HTMLElement = vnode.el = document.createElement(vnode.type)
  const { children, shapeFlags } = vnode

  if (shapeFlags & ShapeFlags.TEXT_CHILDREN)  {
    el.textContent = children
  } else if(shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(children, el)
  }

  const { props } = vnode
  for (const item in props) {
    el.setAttribute(item, props[item])
  }

  container.append(el)
}

function mountChildren(children, container)  {
  for (const vnode of children)  {
    patch(vnode, container)
  }
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountComponent(initialVNode: any, container: any) {
  const instance = createComponentInstance(initialVNode)
  setupComponent(instance)
  setupRenderEffect(instance,initialVNode, container)
}

function setupRenderEffect(instance,initialVNode, container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)
  patch(subTree, container)
  initialVNode.el = subTree.el
}

