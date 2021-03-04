import { Component, App } from 'vue'

declare function InsertWrap(rootCompoent: Component): { rootApp: App<Element> }

export default InsertWrap

type removeComponentCallback = () => void

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $insert(component: Component): removeComponentCallback
  }
}
