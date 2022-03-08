import { h, defineComponent } from 'vue'
import type { Component } from 'vue'
import Wrap from './wrapComponent'

export { useInsert } from './wrapComponent'

export default (rootComponent: Component, containerComponent?: Component) => {
  return defineComponent({
    render () {
      return h(rootComponent, null, {
        default: () => h(Wrap, { containerComponent })
      })
    }
  })
}
