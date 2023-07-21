import { reactive, computed } from '../index'

describe('computed', () => {
  it('happy path', () => {
    const user = reactive({
      age: 1
    })
    const age = computed(() => {
      return user.age
    })

    expect(age.value).toBe(1)
  })

  it ('should computed lazily', () => {
    const value = reactive({
      foo: 1
    })

    const getter = jest.fn(() => {
      return value.foo
    })

    const cValue = computed(getter)
  
    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    //shoud't computed again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)
  })

  it('', () => {
    const a = reactive({
      foo: 1
    })
    const getter = jest.fn(() => {
      return a.foo
    })
    const foo = computed(getter)
    
    foo.value
    expect(getter).toHaveBeenCalledTimes(1)
    a.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)
    expect(foo.value).toBe(2)

    expect(foo.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

    foo.value
    expect(getter).toHaveBeenCalledTimes(2)
  }) 
})