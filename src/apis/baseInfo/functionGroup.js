export default [
  {
    name: '展示功能清单',
    method: 'getFunctionGroupTree',
    path: '/functionGroup/showTree',
    type: 'post'
  },
  {
    name: '校验新增修改功能获分组',
    method: 'checkAddType',
    path: '/functionGroup/checkAddType/:id',
    type: 'post'
  },
  {
    name: '查看单个功能组',
    method: 'getFunctionGroupById',
    path: '/functionGroup/getById/:id',
    type: 'post'
  },
  {
    name: '新增功能组',
    method: 'addFunctionGroup',
    path: '/functionGroup/add',
    type: 'post'
  },
  {
    name: '修改功能组',
    method: 'updateFunctionGroup',
    path: '/functionGroup/update',
    type: 'post'
  },
  {
    name: '删除功能组',
    method: 'deleteFunctionGroup',
    path: '/functionGroup/delete/:id',
    type: 'post'
  },
  {
    name: '查看单个功能',
    method: 'getFunctionById',
    path: '/function/getById/:id',
    type: 'post'
  },
  {
    name: '新增功能',
    method: 'addFunction',
    path: '/function/add',
    type: 'post'
  },
  {
    name: '修改功能',
    method: 'updateFunction',
    path: '/function/update',
    type: 'post'
  },
  {
    name: '删除功能',
    method: 'deleteFunction',
    path: '/function/delete/:id',
    type: 'post'
  },
]