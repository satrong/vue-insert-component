import type { Component, DefineComponent } from 'vue'

type BaseProps = InstanceType<DefineComponent>['$props']

declare function InsertWrap(rootComponent: Component, containerComponent?: Component): Component

export type Callback = (...args: any[]) => void;

export interface InsertOptions<T extends abstract new (...args: any) => any = DefineComponent> extends Record<string, any> {
  component: T;
  /** transfer to components's `props` */
  props?: Omit<InstanceType<T>['$props'], keyof BaseProps>;
  /** execute after `$pluck`, `callback`'s arguments come from `$pluck`'s arguments */
  callback?: Callback;
}

type pluckCallback = () => void
declare function useInsert<T extends abstract new (...args: any) => any> (options: InsertOptions<T>, containerComponent?: Component): pluckCallback;

type tryClose = (...args: any[]) => void
declare function usePluck (): tryClose;
/** @deprecated */
declare function useUninsert (): tryClose;

declare function createInsert(baseOptions: InsertOptions, containerComponent?: Component): (options: Partial<InsertOptions>, containerComponent?: Component) => pluckCallback;

export { InsertWrap as default, useInsert, usePluck, useUninsert, createInsert }

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $insert: <T>(options: InsertOptions<T>, containerComponent?: Component) => pluckCallback;
    $uninsert(...args: any[]): void;
    $pluck(...args: any[]): void;
  }
}
