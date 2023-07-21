import { ref, effect, reactive, isRef, unRef, proxyRefs } from '../index'


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

    a.value = 2

    expect(b).toBe(2)
    expect(c).toBe(2)
  })

  it('should make nested properties reactive', () => {
    const a = ref({
      foo: 1
    })
    let dummy
    effect(() => {
      dummy = a.value.foo
    })
    expect(dummy).toBe(1)
    a.value.foo = 2
    expect(dummy).toBe(2)
  })

  it('isRef', () => {
    const a = ref(1)
    const b = 1
    const c = reactive({
      foo:1
    })

    expect(isRef(a)).toBe(true)
    expect(isRef(b)).toBe(false)
    expect(isRef(c)).toBe(false)
  })

  it('unRef', () => {
    const a = ref(1)
    expect(unRef(a)).toBe(1)
    expect(unRef(1)).toBe(1)
  })

  it('proxyRefs', () => {
    const a = {
      age: ref(1),
      name: 'jack'
    }
    expect(a.age.value).toBe(1)

    const proxyA = proxyRefs(a)
    expect(proxyA.age).toBe(1)
    expect(proxyA.name).toBe('jack')

    proxyA.age = ref(2)
    expect(proxyA.age).toBe(2)
    expect(a.age.value).toBe(2)
  })
})