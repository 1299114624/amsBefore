export default [
  {
    name: '分页查询所有产品',
    method: 'getProductPage',
    path: '/product/page',
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
]