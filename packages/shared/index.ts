export const isObject = (value) => typeof value === 'object' && value !== null

export const extend = Object.assign

export const hasChanged = (oldValue, newValue) => !Object.is(oldValue, newValue)

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)

export const camelize = (str: string) =>  str.replace(/-(\w)/g,(_, c:string) => {
  return c? c.toUpperCase(): ''
})

export const capitalized =(str: string) => str[0].toUpperCase() + str.slice(1)

export const handlerKey= (event) => 'on' + capitalized(event)