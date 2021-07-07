import Vue from 'vue'
import axios from 'axios'
import Router from 'vue-router'
import NProgress from 'nprogress'
import { Login } from 'views/'
import arc from './client.js'
import store from 'store'
import { store as localStore} from 'utils/'

Vue.use(Router)

// 动态添加可访问路由表（具体看store/permission）
const asyncRouterMap = []
let routes = [
  {
    path: '/',
    name: 'Hello',
    isMenu: false,
    hidden: true,
    redirect() {
      return '/welcome'
    }
  },
  {
    path: '/login',
    component: Login,
    name: '登录',
    isMenu: false,
    hidden: true,
  }
]

asyncRouterMap.push(arc)
const router = new Router({ routes: routes })

// 客户OA系统通过url跳转到我们系统报警列表
const oaToBosPath = [
  "/abnormalTradingBehavior/handle/detail"
]

// 路由白名单
const whiteList = ['/login']

// 登录验证
router.beforeEach((to, from, next) => {
  NProgress.start()
  // 获取登录用户基础数据
  const execute = function() {
    store.dispatch('getUserList')
    store.dispatch('GetUserInfo').then(res => {
      const roles = res.permission
      store.dispatch('GenerateRoutes', { roles }).then(() => {
        console.log('addRouters', _.cloneDeep(store.getters.addRouters))
        router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表（具体看store/permission）
        next(to) // hack 方法确保 addRoutes 已完成 
      })
    })
  }
  // 路由跳转逻辑
  const pushRouter = function (type) {
    // uid 在login.js登录时写入
    let isLogin = localStore.get(type)
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      if (to.path === '/login' && isLogin) { // login页面如果是已登录状态则重定向到首页
        next({ path: '/' })
      } else {
        next()
      }
    } else if (!isLogin) {
      next({ path: '/login' })
    } else {
      if(!store.getters.isGetInfo) {
        execute()
      } else {
        next()
      }
    }    
  }
  // 获取系统登录模式
  const getLoginType = async function() {
    await axios.post('/getLoginType', {})
      .then(data => {
        // 0BOS 1 标准SSO 2客户用户名密码模式 3客户用户名密码+token验证模式
        let type = data.data.body.loginType
        // SSO登录url地址
        let url = data.data.body.redirectLoginUrl ? data.data.body.redirectLoginUrl : ''
        // SSO登出url地址
        let logoutUrl = data.data.body.redirectLogoutUrl ? data.data.body.redirectLogoutUrl : ''
        if (type != '0') {
          localStore.set('sso_logout_url', logoutUrl)
        } else {
          localStore.remove('sso_logout_url')
        }
        window.sessionStorage.setItem('af_login_type', type)
        switch (type) {
          case '0' :
            pushRouter('uid')
            break
          case '1' :
            validateToken(url)
            break
          case '2' :
            let pathToken = false;
            oaToBosPath.forEach(el => {
              if (to.path.indexOf(el) != -1) {
                pathToken = true
              }
            })
            if (pathToken && to.query.token) {
              validateToken(url)
            } else {
              pushRouter('uid')
            }
            break
          case '3' :
            validateToken(url)
            break
          default :
            break
        }
      })
  }
  // SSO登录token校验
  const validateToken = async function(sso_url) {

  }
  // 在SSO模式前端使用BOS登录方式
  const isSsoToBos = function() {
    if (to.path == '/loginBos' || to.path == '/loginbos') {
      window.sessionStorage.setItem('af_login_type', '0')
      window.localStorage.removeItem('af_sso_token')
      window.localStorage.removeItem('af_sso_url')
    }
  }  
  isSsoToBos()
  if (window.sessionStorage.getItem('af_login_type')) {
    // 进入系统时如果菜单中带有token直接清除sso_token
    if (to.query.token) {
      localStore.remove('sso_token')
    }
    switch (window.sessionStorage.getItem('af_login_type')) {
      case '0' :
        pushRouter('uid')
        break
      case '1' :
        localStore.get('sso_url') ? validateToken(localStore.get('sso_url')) : getLoginType()
        break
      case '2' :
        pushRouter('uid')
        break  
      case '3' :
        localStore.get('sso_url') ? validateToken(localStore.get('sso_url')) : getLoginType()              
    }
  } else {
    localStore.remove('sso_token')
    getLoginType()
  }

})

router.beforeEach((to, from, next) =>{
  next()
  NProgress.done()
})
router.afterEach(() =>{
  NProgress.done()
})
router.onReady(() =>{
  NProgress.done()
  console.log('===路由相关执行成功===')
})

export { routes, asyncRouterMap, router}
