import type { Component, DefineComponent } from 'vue'

type BaseProps = InstanceType<DefineComponent>['$props']

declare function InsertWrap(rootCompoent: Component, containerComponent?: Component): Component

export type Callback = (...args: any[]) => void;

export interface InsertOptions<T extends abstract new (...args: any) => any = DefineComponent> extends Record<string, any> {
  component: T;
  /** transfer to components's `props` */
  props?: Omit<InstanceType<T>['$props'], keyof BaseProps>;
  /** execute after `$uninsert`, `callback`'s arguments come from `$uninsert`'s arguments */
  callback?: Callback;
}

type uninsertCallback = () => void
declare function useInsert<T extends abstract new (...args: any) => any> (options: InsertOptions<T>, containerComponent?: Component): uninsertCallback;

type tryClose = (...args: any[]) => void
declare function useUninsert (): tryClose;

declare function createInsert(baseOptions: InsertOptions, containerComponent?: Component): (options: Partial<InsertOptions>, containerComponent?: Component) => uninsertCallback;

export { InsertWrap as default, useInsert, useUninsert, createInsert }

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $insert: <T>(options: InsertOptions<T>, containerComponent?: Component) => uninsertCallback;
    $uninsert(...args: any[]): void;
  }
}
