import { Component } from 'vue'

declare function InsertWrap(rootCompoent: Component, containerComponent?: Component): Component

export type Callback = (...args: any[]) => void;

export interface InsertOptions extends Record<string, any> {
  component: Component;
  /** transfer to components's `props` */
  props?: Record<string, any>;
  /** execute after `$uninsert`, `callback`'s arguments come from `$uninsert`'s arguments */
  callback?: Callback;
}

export default InsertWrap

type removeComponentCallback = () => void

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $insert(options: InsertOptions, containerComponent?: Component): removeComponentCallback;
    $uninsert(...args: any[]): removeComponentCallback;
  }
}
