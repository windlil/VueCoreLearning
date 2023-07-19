import { reactive, effect } from '../index'

describe('effect', () => {
  it('happy path', () => {
    const a = reactive({
      age: 1
    })
    let b
    effect(() => {
      b = a.age + 1
    })

    expect(b).toBe(2)

    a.age++

    expect(b).toBe(3)
  })
})