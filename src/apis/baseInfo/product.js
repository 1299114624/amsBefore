export default [
  {
    name: '分页所有产品List',
    method: 'getProductList',
    path: '/product/list',
    type: 'post'
  },
  {
    name: '分页查询所有产品',
    method: 'getProductPage',
    path: '/product/page',
    type: 'post'
  },
  {
    name: '分页查询所有产品',
    method: 'getProductListByCompanyId',
    path: '/product/listByCompanyId/:id',
    type: 'post'
  },
  {
    name: '新增产品',
    method: 'addProduct',
    path: '/product/add',
    type: 'post'
  },
  {
    name: '修改产品',
    method: 'updateProduct',
    path: '/product/update',
    type: 'post'
  },
  {
    name: '删除产品',
    method: 'deleteProduct',
    path: '/product/deleteBatch',
    type: 'post'
  },
  {
    name: '获取该产品所选的所有组件',
    method: 'getProductCom',
    path: '/productComponent/getProductCom',
    type: 'post'
  },
  {
    name: '获取该产品所选的所有差量组件',
    method: 'getDisProductCom',
    path: '/productComponent/getDisProductCom',
    type: 'post'
  },
  {
    name: '添加产品组件',
    method: 'addProductCom',
    path: '/productComponent/addProductCom',
    type: 'post'
  },
  {
    name: '删除组件',
    method: 'deleteProductComponent',
    path: '/productComponent/delete/:id',
    type: 'post'
  },    
]