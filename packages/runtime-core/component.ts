import { publicInstanceHandler } from "./componentPublicInstanceHandler"
import { initProps } from "./componentProps"
import { shallowReadonly } from "packages/reactivity"
import { emit } from "./emit"
import { initSlots } from "./componentSlots"

export function createComponentInstance(vnode, parent) {
  const component = {
    vnode,
    type: vnode.type,
    setupResult: {},
    props: {},
    emit: () => {},
    slots: {},
    provides: {},
    parent
  }

  component.emit = emit.bind(null, component) as any

  return component
}

export function setupComponent(instance) {
  
  initProps(instance, instance.vnode.props)

  initSlots(instance, instance.vnode.children)


  setupStatefulComponent(instance)
}



function setupStatefulComponent(instance) {
  const Component = instance.type

  const { setup } = Component
  const { props } = instance
  instance.proxy = new Proxy({_: instance}, publicInstanceHandler)
  
  if (setup) {
    setCurrentInstance(instance)
    //props should be shallowReadonly
    const setupResult = setup(shallowReadonly(props), { emit: instance.emit })
    setCurrentInstance(null)
    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult) {
  if (typeof setupResult === 'object') {
    instance.setupResult = setupResult
  }

  finishComponnetSetup(instance)
}

function finishComponnetSetup(instance) {
  const Component = instance.type
  if (Component.render) {
    instance.render = Component.render
  }
}

let currentInstance

export function getCurrentInstance() {
  return currentInstance
}

function setCurrentInstance(instance) {
  currentInstance = instance
}