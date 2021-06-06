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

export default [
  login,
  logout,
]