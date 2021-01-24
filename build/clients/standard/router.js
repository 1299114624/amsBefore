/**
 * 针对组件引入：
 * k-v分别对应的是组件名称和组件地址
 * 用来生成router/arc/import.js
 */
var STANDARD_IMPORT = {
    // 基础信息维护-组件管理
    componentManagement: 'views/arc/baseInfoManagement/componentManagement',
    // 基础信息维护-功能管理
    functionManagement: 'views/arc/baseInfoManagement/functionManagement',
    // 基础信息维护-产品管理
    productManagement: 'views/arc/baseInfoManagement/productManagement',
    // 基础信息维护-客制产品管理
    clientProductManagement: 'views/arc/baseInfoManagement/clientProductManagement',
    // 系统异常页面
    NotPermission: 'views/exception/403.vue',
    NotFound: 'views/exception/404.vue',
    // 欢迎使用页面
    Welcome: 'views/exception/welcome.vue',
}

/**
 * 针对模块：
 * k-v分别对应的是模块名称和模块地址
 * 用来生成router/arc/client.js
 */
var STANDARD_VIEWS = {
    baseInfoManagement: './standard/baseInfoManagement.js',
    NotPermission: './standard/notPermission.js',
    Welcome: './standard/welcome.js',
    // 注意notfound要在最后
    NotFound: './standard/notFound.js',
}

module.exports = {
    STANDARD_IMPORT,
    STANDARD_VIEWS
}