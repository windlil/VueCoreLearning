import { ref, effect } from '../index'

describe('ref', () => {
  it('happy path', () => {
    const a = ref(1)
    expect(a.value).toBe(1)

    a.value = 2

    expect(a.value).toBe(2)
  })

  it('it should be reactive', () => {
    const a = ref(1)
    let b = 0
    let c
    effect(() => {
      b++
      c = a.value
    })

    expect(b).toBe(1)
    expect(c).toBe(1)

    a.value = 2

    expect(b).toBe(2)
    expect(c).toBe(2)
  })
})