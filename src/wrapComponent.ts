import {
  getCurrentInstance,
  defineComponent, h, shallowRef, triggerRef
} from 'vue'
import type { PropType, ComponentPublicInstance, VNode, Component } from 'vue'
import { InsertOptions, Callback } from './index.d'

const uidKey = '__insertComponentUid'

type CustomComponentInstance = ComponentPublicInstance | undefined

export default defineComponent({
  name: 'InsertWrap',
  props: {
    containerComponent: Object as PropType<Component>
  },
  setup (props) {
    const list = shallowRef([] as VNode[])
    const cacheCallbacks: { [key: string]: Callback | undefined } = {}

    const instance = getCurrentInstance()

    const getUid = () => Number(String(Math.random()).slice(-6) + new Date().getMilliseconds()).toString(32)

    const onClose = function (this: CustomComponentInstance, ...args: any[]) {
      const that = this
      if (that) {
        const uidKeyVal = that.$attrs[uidKey] as string
        const index = list.value.findIndex(el => {
          return el.props !== null ? el.props[uidKey] === uidKeyVal : false
        })
        list.value.splice(index, 1)
        triggerRef(list)

        const next = cacheCallbacks[uidKeyVal]
        if (typeof next === 'function') {
          next(...args)
          delete cacheCallbacks[uidKeyVal]
        }
      }
    }

    if (instance) {
      Object.assign(instance.appContext.config.globalProperties, {
        $insert: (options: InsertOptions, container?: Component) => {
          const uid = getUid()
          if (typeof options.callback === 'function') {
            cacheCallbacks[uid] = options.callback
          }

          const child = h(options.component as any, {
            [uidKey]: uid,
            key: uid,
            ...options.props,
            onUninsertOnce: onClose
          })

          const comp = container || props.containerComponent
          if (comp) {
            const c = h(comp as any, { title: options.title }, {
              default: () => child
            })
            list.value.push(c)
          } else {
            list.value.push(child)
          }

          triggerRef(list)
        },
        $uninsert: onClose
      })
    }

    return () => list.value.map(el => h(el))
  }
})
