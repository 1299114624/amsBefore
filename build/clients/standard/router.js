/**
 * 针对组件引入：
 * k-v分别对应的是组件名称和组件地址
 * 用来生成router/arc/import.js
 */
var STANDARD_IMPORT = {
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
    NotPermission: './standard/notPermission.js',
    NotFound: './standard/notFound.js',
    Welcome: './standard/welcome.js',
}

module.exports = {
    STANDARD_IMPORT,
    STANDARD_VIEWS
}