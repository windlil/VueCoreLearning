
import { effect } from "packages/reactivity"
import { createComponentInstance, setupComponent } from "./component"
import { ShapeFlags } from "packages/shared/ShapeFlags"
import { hasOwn } from "packages/shared"

export function render(vnode, container, parent) {
  patch(null,vnode, container, parent, null)
}

function patch(n1, n2, container, parnet, anchor) {
  const { shapeFlags, type } = n2

  switch(type) {
    case "Fragment":
      processFragment(n1, n2, container, parnet, anchor)
      break;
    case 'Text':
      processText(n1, n2, container)
      break;
    default:
      if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(n1, n2, container, parnet)
      } else if (shapeFlags & ShapeFlags.ELEMENT) {
        processElement(n1, n2, container, parnet, anchor)
      }
  }
}

function processText(n1, n2, container) {
  const {children} = n2
  const textNode = n2.el =  document.createTextNode(children)
  container.append(textNode)
}

function processFragment(n1, n2, container, parent, anchor) {
  mountChildren(n2.children, container, parent, anchor)
}

function processElement(n1, n2: any, container: any, parent: any, anchor) {
  if (!n1) {
    mountElement(n2, container, parent, anchor)
  } else {
    patchElement(n1, n2, container, parent, anchor)
  }
}

function patchElement(n1, n2, container, parent, anchor) {
  const oldProps = n1.props
  const newProps = n2.props
  const el = n2.el = n1.el

  patchProps(el, oldProps, newProps)
  
  patchChildren(n1, n2, el, parent, anchor)
}


function patchChildren(n1, n2, container, parent, anchor) {
  if (n2.shapeFlags & ShapeFlags.TEXT_CHILDREN) {
    if (n1.shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      removeChilden(n1.children)
      hostSetElementText(container, n2.children)
    } else if (n1.shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      if (n1.children !== n2.children) hostSetElementText(container, n2.children)
    }
  } else if (n2.shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
    if (n1.shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(container, '')
      mountChildren(n2.children, container, parent, anchor)
    } else if (n1.shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      patchKeyChildren(n1.children, n2.children, container, parent, anchor)
    }
  }
}

function patchKeyChildren(c1, c2, container, parent, anchor) {
  let i = 0; 
  let e1 = c1.length - 1
  let e2 = c2.length - 1

  function isSamenVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key
  }
  //left compare
  while(i <= e1 && i <= e2) {
    const n1 = c1[i]
    const n2 = c2[i]
    if (isSamenVNodeType(n1, n2)) {
      patch(n1, n2, container, parent, anchor)
    } else {
      break
    }
    i++
  }
  //right compare
  while(i <= e1 &&i <= e2) {
    const n1 = c1[e1]
    const n2 = c2[e2]

    if (isSamenVNodeType(n1, n2)) {
      patch(n1, n2, container, parent, anchor)
    } else {
      break
    }

    e1--
    e2--
  }

  if (i > e1) {
    if (i <= e2) {
      const nextProp = e2 + 1
      const anchor = e2 +1 > c2.length? null: c2[nextProp].el
      while(i<=e2) {
        patch(null, c2[i], container, parent, anchor)
        i++
      }
    }
  } else if (i > e2) {
    if (i <= e1) {
      while(i <= e1) {
        hostRemove(c1[i].el)
        i++
      }
    }
  }
}

function hostSetElementText(container, text) {
  container.textContent = text
}

function removeChilden(children) {


  for (let i = 0; i< children.length; i++) {
    const el = children[i].el
    hostRemove(el)
  }
}

function hostRemove(child: HTMLElement) {
  const parent = child.parentNode
  if (parent) {
    parent.removeChild(child)
  }
}


function patchProps(el, oldProps, newProps) {
  if (oldProps !== newProps) {
    for (const key in newProps) {
      const prevProp = oldProps[key] || {}
      const nextProp = newProps[key] || {}
  
      if (prevProp !== nextProp) {
        patchProp(el, key, prevProp, nextProp)
      }
    }
  
    for (const key in oldProps) {
      if (!hasOwn(newProps, key)) {
        patchProp(el, key, oldProps[key], null)
      }
    }
  }
}


function mountElement(vnode, container, parent, anchor)  {
  const el:HTMLElement = vnode.el = document.createElement(vnode.type)
  const { children, shapeFlags } = vnode

  if (shapeFlags & ShapeFlags.TEXT_CHILDREN)  {
    el.textContent = children
  } else if(shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(children, el, parent, anchor)
  }

  const { props } = vnode
  for (const item in props) {
    patchProp(el, item,null, props[item])
  }

  if (anchor) {
    container.insertBefore(el, anchor)
  } else {
    container.insertBefore(el, null)
  }
  
}

export function patchProp(el:HTMLElement, key, preVal, nextVal) {
  const isEvent = key.slice(0, 2) === 'on'
  if (isEvent) {
    const event = key.slice(2).toLowerCase()
    el.addEventListener(event, nextVal)
  } else {
    if (nextVal === undefined || nextVal === null) {
      //if prop undefined, delete this prop
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, nextVal)
    }
  }
}

function mountChildren(children, container, parent, anchor)  {
  for (const vnode of children)  {
    patch(null, vnode, container, parent, anchor)
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
      patch(null, subTree, container, instance, null)
      initialVNode.el = subTree.el
      instance.subTree = subTree
      instance.isMounted = true
    } else {
      console.log('update')
      const { proxy } = instance
      const subTree = instance.render.call(proxy)
      const preSubtree = instance.subTree
      patch(preSubtree, subTree, container, instance, null)
      instance.subTree = subTree
    }
  })

}

