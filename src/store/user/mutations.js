import * as types from './mutation_types'
import {store} from 'utils/'

export default {
  [types.SET_PERMISSION] (state, permission) {
    state.permission = permission
  },
  [types.GET_INFO] (state, val) {
    state.isGetInfo = val
  },
  [types.SET_ID] (state, val) {
    state.id = val
  },
  [types.SET_NAME] (state, val) {
    state.name = val
  },
  [types.SET_USERINFO] (state, val) {
    state.userInfo = val
  },
  [types.REMOVE_USERINFO] (state, val) {
    store.remove('userinfo')
  },
}