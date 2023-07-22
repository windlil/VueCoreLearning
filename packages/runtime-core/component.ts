import { publicInstanceHandler } from "./componentPublicInstanceHandler"


export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupResult: {}
  }
  return component
}

export function setupComponent(instance) {
  //TODO
  //initProps()
  //initSlots()

  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const Component = instance.type

  const { setup } = Component

  instance.proxy = new Proxy({_: instance}, publicInstanceHandler)

  if (setup) {
    const setupResult = setup()
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