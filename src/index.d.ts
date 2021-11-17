import { Component } from 'vue'

declare function InsertWrap(rootCompoent: Component, containerComponent?: Component): Component

export type Callback = (...args: any[]) => void;

export interface InsertOptions {
  title?: string;
  component: Component;
  props?: Record<string, any>;
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
