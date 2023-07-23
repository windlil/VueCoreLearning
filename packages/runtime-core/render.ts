
import { effect } from "packages/reactivity"
import { createComponentInstance, setupComponent } from "./component"
import { ShapeFlags } from "packages/shared/ShapeFlags"

export function render(vnode, container, parent) {
  patch(null,vnode, container, parent)
}

function patch(n1, n2, container, parnet) {
  const { shapeFlags, type } = n2

  switch(type) {
    case "Fragment":
      processFragment(n1, n2, container, parnet)
      break;
    case 'Text':
      processText(n1, n2, container)
      break;
    default:
      if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(n1, n2, container, parnet)
      } else if (shapeFlags & ShapeFlags.ELEMENT) {
        processElement(n1, n2, container, parnet)
      }
  }
}

function processText(n1, n2, container) {
  const {children} = n2
  const textNode = n2.el =  document.createTextNode(children)
  container.append(textNode)
}

function processFragment(n1, n2, container, parent) {
  mountChildren(n2.children, container, parent)
}

function processElement(n1, n2: any, container: any, parent: any) {
  if (!n1) {
    mountElement(n2, container, parent)
  } else {
    patchElement(n1, n2, container, parent)
  }
}

function patchElement(n1, n2, container, parent) {
  const oldProps = n1.props
  const newProps = n2.props
  const el = n2.el = n1.el

  patchProps(el, oldProps, newProps)
}

function patchProps(el, oldProps, newProps) {
  for (const key in newProps) {
    const prevProp = oldProps[key]
    const nextProp = newProps[key]

    if (prevProp !== nextProp) {
      patchProp(el, key, prevProp, nextProp)
    }
  }
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
    patchProp(el, item,null, props[item])
  }

  container.append(el)
}

export function patchProp(el, key, preVal, nextVal) {
  console.log('patchProp',nextVal)
  const isEvent = key.slice(0, 2) === 'on'
  if (isEvent) {
    const event = key.slice(2).toLowerCase()
    el.addEventListener(event, nextVal)
  } else {
    el.setAttribute(key, nextVal)
  }
}

function mountChildren(children, container, parent)  {
  for (const vnode of children)  {
    patch(null, vnode, container, parent)
  }
}

function processComponent(n1, n2: any, container: any, parnet: any) {
  mountComponent(n2, container, parnet)
}

function mountComponent(initialVNode: any, container: any, parent: any) {
  const instance = createComponentInstance(initialVNode, parent)
  setupComponent(instance)
  setupRenderEffect(instance,initialVNode, container)
}

function setupRenderEffect(instance,initialVNode, container) {
  effect(() => {
    if (!instance.isMounted) {
      const { proxy } = instance
      const subTree = instance.render.call(proxy)
      patch(null, subTree, container, instance)
      initialVNode.el = subTree.el
      instance.subTree = subTree
      instance.isMounted = true
    } else {
      console.log('update')
      const { proxy } = instance
      const subTree = instance.render.call(proxy)
      const preSubtree = instance.subTree
      patch(preSubtree, subTree, container, instance)
      instance.subTree = subTree
    }
  })

}

