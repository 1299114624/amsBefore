import * as types from './mutation_types'
import {routes as constantRouterMap} from 'router/'

export default {
    [types.SET_ROUTERS] (state, routers) {
        state.addRouters = routers
        state.routers = constantRouterMap.concat(routers)
    },
    [types.SET_PERMISSIONCODE] (state, permissionCode) {
        state.permissionCode = permissionCode
    },
}