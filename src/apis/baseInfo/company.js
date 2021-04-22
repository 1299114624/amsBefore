export default [
  {
    name: '分页查询所有组件',
    method: 'getCompanyPage',
    path: '/company/page',
    type: 'post'
  },
  {
    name: '不分页查询所有组件',
    method: 'getCompanyList',
    path: '/company/list',
    type: 'post'
  },
  {
    name: '新增组件',
    method: 'addCompany',
    path: '/company/add',
    type: 'post'
  },
  {
    name: '修改组件',
    method: 'updateCompany',
    path: '/company/update',
    type: 'post'
  },
  {
    name: '删除组件',
    method: 'deleteCompany',
    path: '/company/deleteBatch',
    type: 'post'
  },
  {
    name: '删除组件',
    method: 'getComByProduct',
    path: '/companyComponent/getComByProduct',
    type: 'post'
  },
]