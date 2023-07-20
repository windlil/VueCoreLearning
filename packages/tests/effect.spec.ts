import { reactive, effect, stop } from '../index'

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
  
  });
  it("should return runner", () => {
      let foo = 10
      const runner = effect(() => {
        foo++
        return 'foo'
      })

      expect(foo).toBe(11)
      const r = runner()
      expect(foo).toBe(12)
      expect(r).toBe('foo')
  })

  it('scheduler', () => {
    let dummy
    let run
    const scheduler = jest.fn(() => {
      run = runner
    })

    const obj = reactive({foo: 1})
    const runner = effect(() => {
      dummy = obj.foo
    }, { scheduler })
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    obj.foo ++
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)
    run()
    expect(dummy).toBe(2)
  })

  it('stop', () => {
    const obj = reactive({ foo : 1})
    let a
    const runner = effect(() => {
      a = obj.foo
    })


    expect(a).toBe(1)

    stop(runner)

    obj.foo = 2

    expect(a).toBe(1)

    runner()

    expect(a).toBe(2)
  })

  it('onStop', () => {
    const obj = reactive({foo: 1})
    let dommy
    const onStop = jest.fn()
    const runner = effect(() => {
      dommy = obj.foo
    }, {
      onStop
    })

    expect(onStop).not.toHaveBeenCalled()

    stop(runner)

    expect(onStop).toHaveBeenCalledTimes(1)
  })
})