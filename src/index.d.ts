import type { Component } from 'vue'

declare function InsertWrap(rootCompoent: Component, containerComponent?: Component): Component

export type Callback = (...args: any[]) => void;

export interface InsertOptions extends Record<string, any> {
  component: Component;
  /** transfer to components's `props` */
  props?: Record<string, any>;
  /** execute after `$uninsert`, `callback`'s arguments come from `$uninsert`'s arguments */
  callback?: Callback;
}

type uninsertCallback = () => void
declare function useInsert (options: InsertOptions, containerComponent?: Component): uninsertCallback;

type tryClose = (...args: any[]) => void
declare function useUninsert (): tryClose;

declare function createInsert(baseOptions: InsertOptions, containerComponent?: Component): (options: Partial<InsertOptions>, containerComponent?: Component) => uninsertCallback;

export { InsertWrap as default, useInsert, useUninsert, createInsert }

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $insert: (options: InsertOptions, containerComponent?: Component) => uninsertCallback;
    $uninsert(...args: any[]): void;
  }
}
