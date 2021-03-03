import { App, Component, createApp } from 'vue'
import Wrap from './wrapComponent'

function Plugin (app: App) {

}

export default (AppVue: Component) => {
  const rootApp = createApp(Wrap, { rootComponent: AppVue })
  return {
    rootApp,
    modal: Plugin
  }
}
