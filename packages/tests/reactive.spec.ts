import { reactive } from '../index'

describe('reactive', () => {
  it('happy path', () => {
    const a = {
      foo: 1
    }
    const b = reactive(a)

    expect(b).not.toBe(a)

    expect(b.foo).toBe(1)
  })
})