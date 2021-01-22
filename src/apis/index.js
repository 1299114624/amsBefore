/**
 * 导出所有模块需要用到的接口
 * 一级属性：模块名
 * 一级属性中的方法：当前模块需要用的接口
 */

 // 基础信息维护-产品管理
 import product from './baseInfo/product'

export default [
  {
    module: 'product',
    name: '产品管理',
    list: product
  }
]