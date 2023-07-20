import { reactive, isReactive, readonly, isReadonly, isProxy } from '../index'

describe('reactive', () => {
  it('happy path', () => {
    const a = {
      foo: 1
    }
    const b = reactive(a)
    const c = readonly(a)

    expect(b).not.toBe(a)

    expect(b.foo).toBe(1)

    expect(isReactive(b)).toBe(true)
    expect(isReactive({
      foo: 1
    })).toBe(false)

    expect(isReadonly(c)).toBe(true)
    expect(isReadonly(b)).toBe(false)

    expect(isProxy(c)).toBe(true)
    expect(isProxy(b)).toBe(true)
    expect(isProxy(a)).toBe(false)
  })
})