export const isObject = (value:any) => typeof value === 'object' && value !== null

export const extend = Object.assign

export const isArray = (value:any) => Array.isArray(value)

export const isIntegerKey = (key:any) => parseInt(key) + '' == key

let hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (target:any, key:any) => hasOwnProperty.call(target,key)

export const hasChanged = (value1:any, value2:any) => value1 !== value2