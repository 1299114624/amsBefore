export const login = {
  name: '登录',
  method: 'login',
  path: '/login',
  type: 'post'
}

export const logout = {
  name: '登出',
  method: 'logout',
  path: '/logout',
  type: 'post'
}

export const userInfo = {
  name: '获取用户信息',
  method: 'userInfo',
  path: '/identity/userInfo',
  type: 'post'
}

export default [
  login,
  logout,
  userInfo,
  {
    name: '是否需要登录验证码',
    method: 'getIsShowValidateCode',
    path: '/getParam',
    type: 'get',    
  },
  {
    name: '获取验证码',
    method: 'getValidateCode',
    path: '/img/getValidateCode',
    type: 'get',    
  },
]