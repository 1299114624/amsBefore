import Vue from 'vue'
import cps from './component'
import plugins from './plugin'
import './polyfill.js'

Vue.use({
  install(Vue, options) {
    // 注册全局方法，如常用的接口方法，工具方法等
    for(var i in plugins) {
      Vue.prototype['$$' + i] = plugins[i]
    }
  }
})

for(var i in cps) {
  var cpName = i.replace(/[A-Z]/g, '-$1').toLowerCase()
  if(cpName && cpName[0] === '-') {
    cpName = cpName.replace('-', '')
  }
  Vue.component(cpName, item)
}