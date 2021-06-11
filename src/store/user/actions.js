import {ajax,store} from 'utils/'
import {userInfo as apiGetUserInfo} from 'apis/user'
export default {
  // 获取用户信息
  GetUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      ajax({
        path: apiGetUserInfo.path,
        type: apiGetUserInfo.type,
        fn: data => {
          store.set('userInfo', data)
          commit('SET_PERMISSION', [data.permission])
          resolve(data)
        },
        errFn: err => {
          reject(err)
        }
      })
    })
  }
}