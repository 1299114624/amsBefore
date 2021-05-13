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
    name: '获取该客户所选的所有组件',
    method: 'getCompanyCom',
    path: '/companyComponent/getCompanyCom',
    type: 'post'
  },
  {
    name: '获取该客户所选的所有差量组件',
    method: 'getDisCompanyCom',
    path: '/companyComponent/getDisCompanyCom',
    type: 'post'
  },
  {
    name: '添加客制产品组件',
    method: 'addCompanyCom',
    path: '/companyComponent/addCompanyCom',
    type: 'post'
  },
  {
    name: '删除组件',
    method: 'deleteCompanyComponent',
    path: '/companyComponent/delete/:id',
    type: 'post'
  },  
]