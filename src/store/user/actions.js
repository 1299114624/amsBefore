import {ajax,store} from 'utils/'
import {userInfo as apiGetUserInfo} from 'apis/user'
import * as types from './mutation_types'
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
          commit('GET_INFO', true)
          resolve(data)
        },
        errFn: err => {
          reject(err)
        }
      })
    })
  },
  remove_userinfo({ commit }) {
    return new Promise(resolve => {
      store.remove('uid')
      commit(types.REMOVE_USERINFO)
      resolve()
    })
  }
}