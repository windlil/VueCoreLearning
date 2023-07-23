import { h, getCurrentInstance } from '../../dist/mini-vue.mjs'
import { foo } from './foo.js'

export const App = {
  render() {

    return h('div',
    {
      style: "color: red",
    },
    [h(
      foo,
      {
      onAddFooTest(a, b) {
        console.log('emit执行', a,b)
      }
      },
      {
        header: ({age}) => h('p', {}, 'age' + age),
        footer: ({ age }) => h('p',{},'age:' +age)
      }
    )
    ])
  },
  setup() {
    const instance = getCurrentInstance()
    console.log(instance)
    return {
      msg: 'mini-vue'
    }
  }
}