/**
 * 基础信息维护路由
 */
import { Content } from 'layout/';
import { componentManagement, functionManagement, productManagement, companyManagement, companyManagementDetail } from '../import';
export default {
    path: 'baseInfoManagement',
    name: 'baseInfoManagement',
    meta: {
        alias: '基础信息维护',
        noGroup: true,
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
            path: 'companyManagement',
            name: 'companyManagement',
            meta: {
                alias: '客户管理',
                parentName: 'baseInfoManagement'
            },
            component: companyManagement,            
        },
        {
            path: 'companyManagementDetail',
            name: 'companyManagementDetail',
            hidden: true,
            meta: {
                alias: '客户管理详情',
                parentName: 'companyManagement'
            },
            component: companyManagementDetail,            
        },
    ]
}