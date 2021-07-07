 /* 由 build/bin/build-router.js 自动生成 */

import { Home } from 'layout/'
import baseInfoManagement from './standard/baseInfoManagement.js';
import NotPermission from './standard/notPermission.js';
import Welcome from './standard/welcome.js';
import NotFound from './standard/notFound.js';

const obj = {
    path: '/',
    name: 'arc',
    isMenu: true,
    icon: 'iconfont icon-shouye',
    meta:{
        alias: '首页'
    },
    redirect: '/home',
    component: Home,
    children: [
       baseInfoManagement,
       NotPermission,
       Welcome,
       NotFound
    ]
}
obj.children.forEach(v1 => {    // 为了让当前页对应的菜单变蓝色
    if(Array.isArray(v1.children)) {
        v1.children.forEach(v2 => {
            v2.meta.parentName = v1.name
            if(Array.isArray(v2.children)) {
                v2.children.forEach(v3 => {
                    v3.meta.parentName = v2.name
                    v3.meta.grandParentName = v1.name
                })
            }
        })
    }
})

export default obj