import store from 'store/'

export function hasPermission(role) {
  const permissions = store.getters.permissions
  if (role === 'Y') {
    return true
  } else {
    return permissions.some(item => item.indexOf(role) >= 0)
  }
}