 /* 由 build/bin/build-router.js 自动生成 */

// 引入所有页面组件
const NotPermission = resolve => require(['views/exception/403.vue'], resolve);
const NotFound = resolve => require(['views/exception/404.vue'], resolve);
const Welcome = resolve => require(['views/exception/welcome.vue'], resolve);

// 导出所有页面
export {
   NotPermission,
   NotFound,
   Welcome
}
