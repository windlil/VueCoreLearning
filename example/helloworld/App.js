import { h } from '../../dist/mini-vue.mjs'

export const App = {
  render() {
    window.self = this
    return h('div',
    {
      style: "color: red"
    },
    [h('p', {style: 'color: blue'}, 'p1'), h('p', {style: 'color: gray'}, this.msg)])
  },
  setup() {
    return {
      msg: 'mini-vue'
    }
  }
}