import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/index.scss'
import App from './App'
import {router} from './router'
import 'register/'
import store from 'store/'
window._ = require('lodash')

Vue.config.productionTip = false
Vue.config.devtools = true

Vue.use(ElementUI)
Vue.use(router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
