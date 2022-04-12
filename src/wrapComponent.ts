import {
  getCurrentInstance, useAttrs,
  defineComponent, h, shallowRef, triggerRef
} from 'vue'
import type { PropType, VNode, Component } from 'vue'
import { InsertOptions, Callback } from './index.d'

const uidKey = '__insertComponentUid'

const getUid = () => Number(String(Math.random()).slice(-6) + new Date().getMilliseconds()).toString(32)
const list = shallowRef([] as VNode[])
const cacheCallbacks: { [key: string]: Callback | undefined } = {}
let defaultContainerComponent: Component | undefined

const onClose = (uidKeyVal: string) => {
  return (...args: any[]) => {
    const index = list.value.findIndex(el => {
      return el.props !== null ? el.props[uidKey] === uidKeyVal : false
    })
    list.value.splice(index, 1)
    triggerRef(list)

    const next = cacheCallbacks[uidKeyVal]
    if (typeof next === 'function') {
      next(...args)
      cacheCallbacks[uidKeyVal] = undefined
    }
  }
}

function insert (options: InsertOptions, container = defaultContainerComponent) {
  const uid = getUid()
  if (typeof options.callback === 'function') {
    cacheCallbacks[uid] = options.callback
  }

  const child = h(options.component as any, {
    [uidKey]: uid,
    key: uid,
    ...options.props,
    onUninsertOnce: onClose(uid),
    onClose: onClose(uid)
  })

  if (container) {
    const c = h(container as any, {
      options,
      onClose: onClose(uid)
    }, {
      default: () => child
    })
    list.value.push(c)
  } else {
    list.value.push(child)
  }

  triggerRef(list)

  return onClose(uid)
}

export const useInsert = insert

export function useUninsert () {
  const instance = getCurrentInstance()

  const tryClose = (...args: any[]) => {
    if (instance) {
      const uid = instance.attrs[uidKey] as string
      if (uid) {
        onClose(uid)(...args)
        return true
      }
    }
    return false
  }

  return tryClose
}

export default defineComponent({
  name: 'InsertWrap',
  props: {
    containerComponent: Object as PropType<Component>
  },
  setup (props) {
    const instance = getCurrentInstance()
    const attrs = useAttrs()
    defaultContainerComponent = props.containerComponent
    if (instance) {
      Object.assign(instance.appContext.config.globalProperties, {
        $insert: insert,
        $uninsert: onClose(attrs[uidKey] as string)
      })
    }

    return () => list.value.map(el => h(el))
  }
})
