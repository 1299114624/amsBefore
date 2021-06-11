import * as types from './mutation_types'

export default {
  [types.SET_PERMISSION] (state, permission) {
    state.permission = permission
  }
}