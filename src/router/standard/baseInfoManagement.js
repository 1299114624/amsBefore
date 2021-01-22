/**
 * 基础信息维护路由
 */
import { Content } from 'layout/';
import { componentManagement, functionManagement, productManagement, clientProductManagement } from '../import';
export default {
    path: 'baseInfoManagement',
    name: 'baseInfoManagement',
    meta: {
        alias: '基础信息维护',
    },
    component: Content,
    children: [
        {
            path: 'componentManagement',
            name: 'componentManagement',
            meta: {
                alias: '组件管理',
                parentName: 'baseInfoManagement'
            },
            component: componentManagement,            
        },
        {
            path: 'functionManagement',
            name: 'functionManagement',
            meta: {
                alias: '功能管理',
                parentName: 'baseInfoManagement'
            },
            component: functionManagement,            
        },
        {
            path: 'productManagement',
            name: 'productManagement',
            meta: {
                alias: '产品管理',
                parentName: 'baseInfoManagement'
            },
            component: productManagement,            
        },
        {
            path: 'clientProductManagement',
            name: 'clientProductManagement',
            meta: {
                alias: '客制产品管理',
                parentName: 'baseInfoManagement'
            },
            component: clientProductManagement,            
        },
    ]
}