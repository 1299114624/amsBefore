import Vue from 'vue'
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

// 路由白名单
const whiteList = ['/login']

// 是否生成路由
let isGenRouter = false

// 登录验证
router.beforeEach((to, from, next) => {
  NProgress.start()

  // 获取登录用户基础数据
  const execute = function() {
    const roles = []
    store.dispatch('GenerateRoutes', { roles }).then(() => {
      console.log('GenerateRoutes', JSON.parse(JSON.stringify(store.getters.addRouters)))
      router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表（具体看store/permission）
      isGenRouter = true
      next(to) // hack 方法确保 addRoutes 已完成 
    })
  }

  // sid 登录状态 boolean
  let sid = localStore.get('uid')
  if (whiteList.indexOf(to.path) !== -1) {
    // 在免登录白名单，直接进入
    if (to.path === '/login' && sid) {
      // login页面如果是已登录状态则重定向到首页
      next({ path: '/' })
    } else {
      next()
    }
  } else if (!sid) {
    next({ path: '/login' })
  } else {
    if (!isGenRouter) {
      execute()
    } else {
      next()
    }
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
