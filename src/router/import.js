 /* 由 build/bin/build-router.js 自动生成 */

// 引入所有页面组件
const componentManagement = resolve => require(['views/arc/baseInfoManagement/componentManagement'], resolve);
const functionManagement = resolve => require(['views/arc/baseInfoManagement/functionManagement'], resolve);
const productManagement = resolve => require(['views/arc/baseInfoManagement/productManagement'], resolve);
const companyManagement = resolve => require(['views/arc/baseInfoManagement/companyManagement'], resolve);
const companyManagementDetail = resolve => require(['views/arc/baseInfoManagement/companyManagement/detail'], resolve);
const NotPermission = resolve => require(['views/exception/403.vue'], resolve);
const NotFound = resolve => require(['views/exception/404.vue'], resolve);
const Welcome = resolve => require(['views/exception/welcome.vue'], resolve);

// 导出所有页面
export {
   componentManagement,
   functionManagement,
   productManagement,
   companyManagement,
   companyManagementDetail,
   NotPermission,
   NotFound,
   Welcome
}
