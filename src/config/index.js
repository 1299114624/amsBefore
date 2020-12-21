import store from 'store'
import { router } from 'router'
var CLIENT = process.env.CLIENT || 'standard'
var info = require(`./../../build/clients/${CLIENT}/info.js`)

const gbs = {
    // 客户基础信息
    clientName: info.clientName,
    clientFullName: info.clientFullName,
    clientSysName: info.clientSysName,

    fileUploadPath: "/arc/files/upload",
    fileDownloadPath: "/arc/files/down",
    host: '/arc',
    // 本地存储的 prefix key
    db_prefix: 'af_',

    // 每页的记录数
    pageSize: 20,
    // 每页显示的个数选择器设置
    pageSizes: [10, 20, 30, 40, 50],
}

export { gbs }
