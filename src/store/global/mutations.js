import * as types from './mutation_types'

export default {
  [types.ENUMDICT_UPDATE] (state, value) {
    state.enumDicts = value
  },
  [types.USERLIST_UPDATE] (state, value) {
    state.userList = value
  },
}