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
        role: ["AVM"]
    },
    component: Content,
    children: [
        {
            path: 'componentManagement',
            name: 'componentManagement',
            meta: {
                alias: '组件管理',
                role: ["AVM01"]
            },
            component: componentManagement,            
        },
        {
            path: 'functionManagement',
            name: 'functionManagement',
            meta: {
                alias: '功能管理',
                role: ["AVM02"]
            },
            component: functionManagement,            
        },
        {
            path: 'productManagement',
            name: 'productManagementContent',
            meta: {
                alias: '产品管理',
                role: ["AVM03"]
            },
            redirect: 'productManagement',
            component: Content,   
            children: [
                {
                    path: '',
                    name: 'productManagement',
                    meta: {
                        alias: '产品管理',
                        role: ["AVM0301"]
                    },
                    component: productManagement,                       
                },
                {
                    path: 'productManagementDetail',
                    name: 'productManagementDetail',
                    hidden: true,
                    meta: {
                        alias: '产品管理详情',
                        role: ["AVM0302"]
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
                role: ["AVM04"]
            },
            redirect: 'companyManagement',
            component: Content,   
            children: [
                {
                    path: '',
                    name: 'companyManagement',
                    meta: {
                        alias: '客户管理',
                        role: ["AVM0401"]
                    },
                    component: companyManagement,                      
                },
                {
                    path: 'companyManagementDetail',
                    name: 'companyManagementDetail',
                    hidden: true,
                    meta: {
                        alias: '客户管理详情',
                        role: ["AVM0402"]
                    },
                    component: companyManagementDetail,            
                },
            ]        
        },

    ]
}