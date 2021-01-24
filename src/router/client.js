 /* 由 build/bin/build-router.js 自动生成 */

import { Home } from 'layout/'
import baseInfoManagement from './standard/baseInfoManagement.js';
import NotPermission from './standard/notPermission.js';
import Welcome from './standard/welcome.js';
import NotFound from './standard/notFound.js';

export default {
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
