import {store} from 'utils/'
import {gbs} from 'config/'
export default {
  data() {
    return {
      title: gbs.clientSysName,
      winSize: {
        width: '',
        height: ''
      },
      remember: this.$store.state.user.remember,
      login_actions: {
        disabled: false
      },
      data: {
        userName: '',
        password: '',
        code: '',
      },
      isCapslock: false,
      rule_data: {
        userName: [{
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请输入用户名'))
            } else if (value === 'allOp') {
              callback()
            } else {
              if (/^[a-zA-Z0-9_-]{1,20}$/.test(value)) {
                callback()
              } else {
                callback(new Error('用户名格式错误'))
              }
            }
          },
          trigger: 'blur'
        }],
        password: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入密码'))
            } else {
              callback()
            }
          },
          trigger: 'blur'          
        }],
        code: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入验证码'))
            } else {
              callback()
            }
          },
          trigger: 'blur'              
        }],
      },
      base64Image: '',
      isShowValidateCode: false
    }
  },
  created() {
    this.setSize()
    $(window).resize(() => {
      this.setSize()
    })
  },
  mounted () {
    // 如果上次登录选择的是记住密码并登录成功，则会保存状态、用户名及token
    if (this.remember.remember_flag) {
      this.data.userName = this.remember.remember_login_info.userName
      this.data.password = this.remember.remember_login_info.password
      this.$set(this.data, 'token', this.remember.remember_login_info.token)
    }
    this.getIsShowValidateCode()
  },
  methods: {
    checkCapslock() {},
    setSize() {
      this.winSize.width = document.body.clientWidth + 'px'
      this.winSize.height = document.documentElement.clientHeight + 'px'
    },
    // 系统是否展示验证码
    getIsShowValidateCode() {
      this.$$api_user_getIsShowValidateCode({
        fn: data => {
          if (data.validateSwitch == '1') {
            this.isShowValidateCode = true
            this.getValidateCode()
          } else {
            this.isShowValidateCode = false
          }
        }
      })
    },
    // 获取验证码
    getValidateCode() {
      this.$$api_user_getValidateCode({
        fn: data => {
          this.base64Image = `data:image/png;base64,${data}`
        }
      })
    },
    // 更新验证码
    refreshValidateCode() {
      this.data.code = ''
      this.getValidateCode()
    },
    // 混淆加密
    softdog(str, sign) {
      if (typeof str !== 'string' || !str) {
        return ''
      }
      let newStr = ''
      for (let i = 0; i < str.length; i++) {
        newStr += String.fromCharCode(str.charCodeAt(i) + sign * 2)
      }
      return newStr
    },
    onLogin() {
      this.$refs.data.validate(valid => {
        if (valid) {
          let encryptPassword = this.softdog(window.btoa(this.data.password), 1)
          let loginInfo = `password=${encryptPassword}&username=${this.data.userName}`
          if (this.isShowValidateCode) {
            loginInfo = `${loginInfo}&code=${this.data.code}`
          }
          this.login_actions.disabled = true
          new Promise((resolve, reject) => {
            // 服务端登录验证优先级：用户名必须，其次先取token，不存在时再去密码
            this.$$api_user_login({
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: loginInfo,
              fn: data => {
                // 登录成功之后，验证是否记住密码，如果记住密码，本地保存记住信息
                // 如果没有记住，就初始化本地记住信息
                if (this.remember.remember_flag) {
                  this.$store.dispatch('update_remember', {
                    remember_flag: this.remember.remember_flag,
                    remember_login_info: {
                      userName: this.data.userName,
                      password: this.data.password
                    }
                  })
                } else {
                  this.$store.dispatch('remove_remember')
                }
                resolve()
              },
              errFn: (err) => {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: err.msg
                })
                this.login_actions.disabled = false
                // 登录失败自动刷新验证码
                if (this.isShowValidateCode) {
                  this.refreshValidateCode()
                }
                reject(err)
              }
            })
          }).then(() => {
            store.set('uid', 'login')
            this.$store.dispatch('enumDicts_load').then(() => {
              location.reload()
            })
          })
        }
      })
    }
  }
}