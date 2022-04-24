import { h, defineComponent } from 'vue'
import type { Component } from 'vue'
import Wrap, { useInsert } from './wrapComponent'
import type { InsertOptions } from './index.d'

export { useInsert, useUninsert } from './wrapComponent'

export function createInsert (baseOptions: Partial<InsertOptions> = {}) {
  return (options: InsertOptions, containerComponent?: Component) => {
    return useInsert(Object.assign({}, baseOptions, options), containerComponent)
  }
}

export default (rootComponent: Component, containerComponent?: Component) => {
  return defineComponent({
    render () {
      return h(rootComponent, null, {
        default: () => h(Wrap, { containerComponent })
      })
    }
  })
}
