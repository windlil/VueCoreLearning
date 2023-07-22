import { h } from '../../dist/mini-vue.mjs'
import { foo } from './foo.js'

export const App = {
  render() {

    return h('div',
    {
      style: "color: red",
    },
    [h(foo,{
      onAddFooTest(a, b) {
        console.log('emit执行', a,b)
      }
    })])
  },
  setup() {
    return {
      msg: 'mini-vue'
    }
  }
}