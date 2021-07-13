import * as types from './mutation_types'

export default {
  [types.ENUMDICT_UPDATE] (state, value) {
    state.enumDicts = value
  },
  [types.USERLIST_UPDATE] (state, value) {
    state.userList = value
  },
  [types.UPDATE_SERVEROSINFO] (state, value) {
    state.serverOSInfo = value
  },
  [types.UPDATE_ERRORINFO] (state, value) {
    state.errorInfo = value
  },
}