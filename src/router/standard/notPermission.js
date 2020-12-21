import { NotPermission } from '../import'
export default {
    path: 'notPermission',
    name: 'notPermission',
    meta: {
        alias: '无权访问',
        bread: true
    },
    leaf: false,
    hidden: true,
    component: NotPermission
}