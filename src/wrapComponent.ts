import {
  Component, PropType, getCurrentInstance,
  defineComponent, h, shallowRef, triggerRef, ComponentPublicInstance, VNode
} from 'vue'
import { InsertOptions } from './index.d'

const uidKey = '__insertComponentUid'
const cbName = uidKey + 'Cb'

type CustomComponentInstance = ComponentPublicInstance | undefined

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

    const onClose = function (this: CustomComponentInstance, ...args: any[]) {
      const that = this
      if (that) {
        const index = list.value.findIndex(el => {
          return el.props !== null ? el.props[uidKey] === that.$attrs[uidKey] : false
        })
        list.value.splice(index, 1)
        triggerRef(list)
        if (typeof that.$attrs.__insertComponentUidCb === 'function') {
          that.$attrs.__insertComponentUidCb(...args)
        }
      }
    }

    if (instance) {
      Object.assign(instance.appContext.config.globalProperties, {
        $insert: (options: InsertOptions) => {
          const uid = getUid()
          list.value.push(h(options.component as any, {
            [uidKey]: uid,
            [cbName]: options.callback,
            key: uid,
            ...options.props,
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
