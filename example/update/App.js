import { h, ref} from '../../dist/mini-vue.mjs'

const App = {
  setup() {
    const count = ref(0)

    const onClick =() => {
      count.value++
    }

    return {
      onClick,
      count,
    }
  },
  render() {
    return h(
      'div',
      {
        id: "root",
        foo: this.count
      },
      [
        h('div', {}, "count:" + this.count),
        h('button', {
          onClick: this.onClick
        },
        'click'
        )
      ]
    )
  }

}

export default App
