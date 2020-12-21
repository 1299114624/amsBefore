import { asyncRouterMap } from 'router'

function hasPermission(roles, route) {
    return true
    // if (route.meta && route.meta.role) {
    //     return roles.includes(route.meta.role)
    // } else {
    //     return true
    // }
}

export default {
    GenerateRoutes: ({ commit }, data) => {
        return new Promise(resolve => {
            const { roles } = data
            // 递归
            let parseTree = treeNodes => {
                if(!treeNodes.children || !treeNodes.children.length) return
                treeNodes.children = treeNodes.children.filter(child => {
                    if (hasPermission(roles, child)) {
                        return true
                    } else {
                        return false
                    }
                })
                for (let i = 0; i < treeNodes.children.length; i++) {
                    if (treeNodes.children[i].children && treeNodes.children[i].children.length > 0) {
                        parseTree(treeNodes.children[i])
                    }
                }
            }
            for (let i = 0; i < asyncRouterMap.length; i++) {
                if (!asyncRouterMap.children) continue
                asyncRouterMap[i].children = asyncRouterMap[i].children.filter(v => {
                    if (hasPermission(roles, v)) {
                        if (v.children && v.children.length > 0) {
                            parseTree(v)
                            return true
                        } else {
                            return true
                        }
                    } else {
                        return false
                    }
                })
            }
            let arr = asyncRouterMap[0] ? asyncRouterMap[0].children : []
            commit('SET_ROUTERS', asyncRouterMap)
            resolve()
        })
    }
}