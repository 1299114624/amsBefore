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

    // websocket的地址
    wsHost: '/arc/websocket',

    // 本地存储的 prefix key
    db_prefix: 'af_',

    // 数据字典唯一字段名称
    enumDicts_key_field: 'code',

    // 状态码字段
    api_status_key_field: 'code',
    // 状态码value
    api_status_value_field: '0',
    // 返回数据体key
    api_data_field: 'body',

    // 每页的记录数
    pageSize: 20,
    // 每页显示的个数选择器设置
    pageSizes: [10, 20, 30, 40, 50],

    api_custom: {
        404: function(res) {
            this.$alert(res.status + ',' + res.msg + '!', '错误', {
                confirmButtonText: '确定'
            })
        },
        10004: res => {
            if (window.localStorage.getItem('af_sso_url')) {
                window.localStorage.removeItem('af_sso_token')
            } else {
                store.dispatch('remove_userinfo').then(() => {
                    router.push('/login')
                })
            }
        }
    }
}

export { gbs }
