export default [
  {
    name: '分页查询所有组件',
    method: 'getComponentPage',
    path: '/component/page',
    type: 'post'
  },
  {
    name: '新增组件',
    method: 'addComponent',
    path: '/component/add',
    type: 'post'
  },
  {
    name: '修改组件',
    method: 'updateComponent',
    path: '/component/update',
    type: 'post'
  },
  {
    name: '删除组件',
    method: 'deleteComponent',
    path: '/component/deleteBatch',
    type: 'post'
  },
]