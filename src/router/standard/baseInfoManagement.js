/**
 * 基础信息维护路由
 */
import { Content } from 'layout/';
import { componentManagement, functionManagement, productManagement, companyManagement, productManagementDetail, companyManagementDetail } from '../import';
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
            name: 'productManagementContent',
            meta: {
                alias: '产品管理',
                parentName: 'baseInfoManagement'
            },
            redirect: 'productManagement',
            component: Content,   
            children: [
                {
                    path: '',
                    name: 'productManagement',
                    meta: {
                        alias: '产品管理',
                        parentName: 'productManagementContent'
                    },
                    component: productManagement,                       
                },
                {
                    path: 'productManagementDetail',
                    name: 'productManagementDetail',
                    hidden: true,
                    meta: {
                        alias: '产品管理详情',
                        parentName: 'productManagementContent',
                        grandParentName: 'baseInfoManagement'
                    },
                    component: productManagementDetail,            
                },                 
            ]         
        },       
        {
            path: 'companyManagement',
            name: 'companyManagementContent',
            meta: {
                alias: '客户管理',
            },
            redirect: 'companyManagement',
            component: Content,   
            children: [
                {
                    path: '',
                    name: 'companyManagement',
                    meta: {
                        alias: '客户管理',
                    },
                    component: companyManagement,                      
                },
                {
                    path: 'companyManagementDetail',
                    name: 'companyManagementDetail',
                    hidden: true,
                    meta: {
                        alias: '客户管理详情',
                        parentName: 'companyManagementContent',
                        grandParentName: 'baseInfoManagement'
                    },
                    component: companyManagementDetail,            
                },
            ]        
        },

    ]
}