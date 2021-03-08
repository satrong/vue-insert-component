import { Component, App } from 'vue'

declare function InsertWrap(rootCompoent: Component): App<Element>

export interface InsertOptions {
  component: Component;
  props?: { [key: string]: any };
  callback?: (...args: any[]) => void;
}

export default InsertWrap

type removeComponentCallback = () => void

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $insert(options: InsertOptions): removeComponentCallback;
    $uninsert(...args: any[]): removeComponentCallback;
  }
}
