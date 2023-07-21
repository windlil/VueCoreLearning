export const isObject = (value) => typeof value === 'object' && value !== null

export const extend = Object.assign

export const hasChanged = (oldValue, newValue) => !Object.is(oldValue, newValue)