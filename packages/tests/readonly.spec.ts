import { readonly } from '../index'

describe('readonly', () => {
  it('happy path', () => {
    console.warn = jest.fn()
    const obj = readonly({foo: 1})

    obj.foo = 2

    expect(console.warn).toBeCalled()
  })
})