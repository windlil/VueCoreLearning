import { publicInstanceHandler } from "./componentPublicInstanceHandler"
import { initProps } from "./componentProps"
import { shallowReadonly } from "packages/reactivity"
import { emit } from "./emit"


export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupResult: {},
    props: {},
    emit: () => {}
  }

  component.emit = emit.bind(null, component) as any

  return component
}

export function setupComponent(instance) {
  //TODO
  //initSlots()
  console.log(instance.vnode.props)
  initProps(instance, instance.vnode.props)

  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const Component = instance.type

  const { setup } = Component
  const { props } = instance
  instance.proxy = new Proxy({_: instance}, publicInstanceHandler)
  
  if (setup) {
    //props should be shallowReadonly
    const setupResult = setup(shallowReadonly(props), { emit: instance.emit })
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