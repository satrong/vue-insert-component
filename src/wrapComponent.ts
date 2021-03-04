import {
  defineComponent, Component, PropType, getCurrentInstance,
  h, shallowRef, triggerRef
} from 'vue'

export default defineComponent({
  name: 'InsertWrap',
  props: {
    rootComponent: {
      type: Object as PropType<Component>
    }
  },
  setup () {
    const list = shallowRef([] as Component[])

    const instance = getCurrentInstance()
    if (instance) {
      instance.appContext.config.globalProperties.$insert = (component: Component) => {
        list.value.push(component)
        triggerRef(list)
      }
    }

    return { list }
  },
  render () {
    return [
      this.rootComponent ? h(this.rootComponent) : h('div'),
      ...this.list.map(item => h(item))
    ]
  }
})
