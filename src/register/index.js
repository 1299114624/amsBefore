import Vue from 'vue'
import cps from './component'
import { gbs } from 'config/'
import mixins from './mixin'
import plugins from './plugin'
import './polyfill.js'
import Websocketio from 'vue-native-websocket'

let isWs = 'https:' == document.location.protocol ? 'wss://' : 'ws://'
Vue.use(Websocketio, isWs + location.host + gbs.wsHost, {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 3000,
})

Vue.use({
  install(Vue, options) {
    Vue.mixin(mixins)
    // 注册全局方法，如常用的接口方法，工具方法等
    for(var i in plugins) {
      Vue.prototype['$$' + i] = plugins[i]
    }
  }
})

for(var i in cps) {
  var cpName = i.replace(/([A-Z])/g, '-$1').toLowerCase()
  if(cpName && cpName[0] === '-') {
    cpName = cpName.replace('-', '')
  }
  Vue.component(cpName, cps[i])
}