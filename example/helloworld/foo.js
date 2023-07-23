import { h,renderSlots, getCurrentInstance  } from '../../dist/mini-vue.mjs'
export const foo = {
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    console.log(instance)
    const emitCount = () => {
      console.log('点击了')
      emit('add-foo-test', 1, 2)
    }

    return {
      emitCount,
    }
  },
  render() {
    
    const age = 5
    const btn = h('button',{
      onClick: () => {
        this.emitCount()
      }
    },'点击')
    return h('div', {}, [
      renderSlots(this.$slots, 'header', {
        age
      }),
      btn, renderSlots(this.$slots, 'footer', {
      age
    })])
  }
}