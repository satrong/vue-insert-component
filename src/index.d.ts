import { Component } from 'vue'

declare function InsertWrap<T>(compoent: Component): { rootApp: T }

export default InsertWrap

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $insert(component: Component): void
  }
}
