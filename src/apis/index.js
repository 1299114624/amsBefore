/**
 * 导出所有模块需要用到的接口
 * 一级属性：模块名
 * 一级属性中的方法：当前模块需要用的接口
 */
// 用户信息
import user from './user'

// 基础信息维护-组件管理
import component from './baseInfo/component'
// 基础信息维护-功能管理
import functionGroup from './baseInfo/functionGroup'
 // 基础信息维护-产品管理
 import product from './baseInfo/product'
 // 基础信息维护-客户管理
 import company from './baseInfo/company'

export default [
  {
    module: 'user',
    name: '用户管理',
    list: user
  }, {
    module: 'component',
    name: '组件管理',
    list: component
  }, {
    module: 'functionGroup',
    name: '功能管理',
    list: functionGroup
  }, {
    module: 'product',
    name: '产品管理',
    list: product
  }, {
    module: 'company',
    name: '客户管理',
    list: company
  },
]