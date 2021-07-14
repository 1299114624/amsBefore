import {routes as constantRouterMap} from 'router'
export default {
  isGetInfo: false,
  id: '', //用户唯一标识
  name: '游客',
  userInfo: {},
  // 记住密码相关信息，现在暂且只做记住一个账号密码
  // 后期：每登陆成功一次，就缓存到列表中，然后在登录表单，输入时，会出现下拉列表选择之前登陆过的用户
  remember: {
    remember_flag: false,
    remember_login_info: {
      username: '',
      token: ''
    }
  }
}