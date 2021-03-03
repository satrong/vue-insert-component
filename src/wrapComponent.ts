import { defineComponent, Component, PropType, h, getCurrentInstance } from 'vue'

export default defineComponent({
  name: 'InsertWrap',
  props: {
    rootComponent: {
      type: Object as PropType<Component>
    }
  },
  data () {
    return {
      list: [] as Component[]
    }
  },
  render () {
    return [
      this.rootComponent ? h(this.rootComponent) : h('div'),
      ...this.list.map(item => h(item))
    ]
  },
  beforeCreate () {
    const instance = getCurrentInstance()
    if (instance) {
      instance.appContext.config.globalProperties.$insert = (component: Component) => this.list.push(component)
    }
  }
})
