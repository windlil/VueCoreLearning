import { h, ref} from '../../dist/mini-vue.mjs'

const App = {
  setup() {
    const count = ref(0)

    const onClick =() => {
      count.value++
    }

    const props = ref({
      foo: "foo",
      bar: 'bar'
    })

    const onChangeProps1 = () => {
      props.value.foo = undefined
    }
    const onChangeProps2 = () => {
      props.value = {
        foo: 'foo'
      }
    }

    return {
      onClick,
      onChangeProps1,
      onChangeProps2,
      count,
      props
    }
  },
  render() {
    return h(
      'div',
      {
        id: "root",
        count: this.count,
        foo: this.props.foo,
        bar: this.props.bar
      },
      [
        h('div', {}, "count:" + this.count),
        h('button', {
          onClick: this.onClick
        },
        'click'
        ),
        h('button', {
          onClick: this.onChangeProps1
        },
        'undefined'
        ),
        h('button', {
          onClick: this.onChangeProps2
        },
        'button3'
        )
      ]
    )
  }

}

export default App
