export const getAllDicts = {
  name: '获取enum数据字典',
  method: 'getAllDicts',
  path: '/allDicts',
  type: 'post',
}
export const getServerOsInfo = {
  name: '获取系统时间',
  method: 'getServerOsInfo',
  path: '/serverOsInfo/getTime',
  type: 'get',
}
export const getSystemInfo = {
  name: '获取系统信息',
  method: 'getSystemInfo',
  path: '/system/info',
  type: 'post',
}

export const list = [getAllDicts, getServerOsInfo, getSystemInfo]