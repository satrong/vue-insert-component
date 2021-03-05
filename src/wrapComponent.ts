import {
  DefineComponent, Component, PropType, getCurrentInstance,
  defineComponent, h, shallowRef, triggerRef, ComponentPublicInstance, VNode
} from 'vue'

const uidKey = '__insertComponentUid'

export default defineComponent({
  name: 'InsertWrap',
  props: {
    rootComponent: {
      type: Object as PropType<Component>
    }
  },
  setup () {
    const list = shallowRef([] as VNode[])

    const instance = getCurrentInstance()

    const getUid = () => Number(String(Math.random()).slice(-6) + new Date().getMilliseconds()).toString(32)

    const onClose = function (this:ComponentPublicInstance | undefined, ctx?: ComponentPublicInstance) {
      const that = ctx || this
      if (that) {
        const index = list.value.findIndex(el => {
          return el.props !== null ? el.props[uidKey] === that.$attrs[uidKey] : false
        })
        list.value.splice(index, 1)
        triggerRef(list)
      }
    }

    if (instance) {
      Object.assign(instance.appContext.config.globalProperties, {
        $insert: (component: DefineComponent) => {
          const uid = getUid()
          list.value.push(h(component, {
            [uidKey]: uid,
            key: uid,
            onUninsertOnce: onClose
          }))
          triggerRef(list)
        },
        $uninsert: onClose
      })
    }

    return { list }
  },
  render () {
    return [
      this.rootComponent ? h(this.rootComponent) : h('div'),
      ...this.list
    ]
  }
})
