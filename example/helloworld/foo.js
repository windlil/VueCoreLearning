import { h } from '../../dist/mini-vue.mjs'
export const foo = {
  setup(props, { emit }) {
    props.count++
    const emitCount = () => {
      console.log('点击了')
      emit('add-foo-test', 1, 2)
    }
    return {
      emitCount
    }
  },
  render() {
    const btn = h('button',{
      onClick: () => {
        this.emitCount()
      }
    },'点击')
    return h('div',{}, [btn])
  }
}