import * as types from './mutation_types'
import {store} from 'utils/'

export default {
  [types.SET_PERMISSION] (state, permission) {
    state.permission = permission
  },
  [types.GET_INFO] (state, val) {
    state.isGetInfo = val
  },
  [types.REMOVE_USERINFO] (state, val) {
    store.remove('userinfo')
  }
}