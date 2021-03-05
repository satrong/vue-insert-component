import { Component, createApp } from 'vue'
import Wrap from './wrapComponent'

export default (rootComponent: Component) => createApp(Wrap, { rootComponent })
