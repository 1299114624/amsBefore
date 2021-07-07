import Vue from 'vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import { router } from 'router'
import { MessageBox, Message } from 'element-ui'
import { store as localStore } from 'utils'
import { gbs } from 'config'
Vue.use(VueAxios, axios)

// 动态设置本地和线上接口域名
Vue.axios.defaults.baseURL = gbs.host

const cbs = {
  /**
   * ajax请求成功，返回的状态码不是200时调用
   * @param {object} err 返回的对象，包含错误码和错误信息
   */
  statusError (err) {
    console.error(err)
    Message({
      showClose: true,
      message: '返回错误：' + err.msg,
      type: 'error'
    })
  }
}

let isShowSsoUrlConfirm = false

/**
 * @description: 封装axios的通用请求
 * @param {Sting}   type      get或post
 * @param {Sting}   url       请求的接口URL
 * @param {object}  data      传的参数，没有则传空对象
 * @param {Function}  fn      回调函数
 * @param {bollean} tokenFlag 是否需要携带token参数，为true，不需要；false，需要。一般除了登录，都需要
 */
export default async function({
  type,
  path,
  data,
  download,
  resCode,
  fn,
  errFn,
  tokenFlag,
  headers,
  opts
} = {}) {
  let options = {
    method: type,
    url: path,
    responseType: download ? 'blob' : 'json',
    headers: headers && typeof headers === 'object' ? headers : {},
  }

  // 检测接口权限（权限目前全部放到后台来做）
  let api_flag = true

  if (api_flag === true) {
    options[type === 'get' ? 'params' : 'data'] = data
    // SSO登录在header中增加token信息
    if (localStore.get('token')) {
      options.headers.usertoken = localStore.get('token')
      options.headers.userid = localStore.get('userId')
      options.headers.username = localStore.get('userName')
    }
    // axios内置属性均可写在这里
    if (opts && typeof opts === 'object') {
      // es6写法
      Object.assign(options, opts)
    }
    // 发送请求
    await Vue.axios(options).then(res => {
      if (download) { // 文件下载

      } else {
        if (res.data[gbs.api_status_key_field] == gbs.api_status_value_field) {   // code == 0 时
          fn(res.data[gbs.api_data_field])
        } else {  // code 非 0 时
          if (gbs.api_custom[res.data[gbs.api_status_key_field]]) { // 返回code 为 404 或者 10004            
            gbs.api_custom[res.data[gbs.api_status_key_field]].call(this, res.data)
          } else {            
            if (errFn) {
              errFn.call(this, res.data)
            } else {
              cbs.statusError.call(this, res.data)
            }
          }
        }
      }
    }).catch(err => {
      console.error("请求地址：" + path, "错误：" + err);
      //  未登录
      if(!err.response) {
        return false
      }
      if (err.response.status === 401) {
        localStore.remove('uid')
        localStore.remove('token')
        localStore.remove('userId')
        localStore.remove('userName')
        if (errFn) {
          errFn.call(this, {msg: '登陆超时，请重新登陆。', status: '401'})
        }
        if (localStore.get('sso_url')) {
          if (isShowSsoUrlConfirm) {
            return
          }
          let sso_url = localStore.get('sso_url')
          localStore.remove('sso_token')
          isShowSsoUrlConfirm = true
          MessageBox.confirm('登录超时，是否跳转到登陆页面重新登陆？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            isShowSsoUrlConfirm = false
            window.open(sso_url)
          }).catch(() => {
            isShowSsoUrlConfirm = false
          })
        } else {
          router.push('/login')
        }
      } else if (err.response.status === 403) {
        Message({
          showClose: true,
          message: '您没有请求该页面接口的权限',
          type: 'error'
        })
        router.push('/notPermission')
      } else if (err.response.status === 404) {
        if (path === '/login') {
          Message({
            showClose: true,
            message: '服务器请求错误（500），请联系管理员',
            type: 'error'            
          })
        } else {
          if (errFn) {
            errFn.call(this, {msg: '服务器请求错误（404），请联系管理员', status: '404'})
          }
        }
      }
    })
  } else {
    MessageBox.alert('您没有权限请求该接口！', '请求错误', {
      confirmButtonText: '确定',
      type: 'warning'
    })
  }
}

