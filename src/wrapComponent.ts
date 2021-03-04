import {
  DefineComponent, Component, PropType, getCurrentInstance,
  defineComponent, h, shallowRef, triggerRef
} from 'vue'

export default defineComponent({
  name: 'InsertWrap',
  props: {
    rootComponent: {
      type: Object as PropType<Component>
    }
  },
  setup () {
    const list = shallowRef([] as DefineComponent[])

    const instance = getCurrentInstance()
    if (instance) {
      instance.appContext.config.globalProperties.$insert = (component: DefineComponent) => {
        list.value.push(component)
        triggerRef(list)
      }
    }

    return {
      list,
      onClose (component: DefineComponent) {
        const index = list.value.findIndex(el => el === component)
        list.value.splice(index, 1)
        triggerRef(list)
      }
    }
  },
  render () {
    return [
      this.rootComponent ? h(this.rootComponent) : h('div'),
      ...this.list.map(item => h(item, {
        onUninsertOnce: () => this.onClose(item)
      }))
    ]
  }
})
