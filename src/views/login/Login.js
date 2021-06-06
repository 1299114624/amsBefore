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
        userName: [],
        password: [],
        code: [],
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
    if (this.remember.remember_flag === true) {
      this.data.userName = this.remember.remember_login_info.userName
      this.data.password = this.remember.remember_login_info.password
      this.$set(this.data, 'token', this.remember.remember_login_info.token)
    }
    this.getIsShowValidateCode()
  },
  methods: {
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
        }
      })
    }
  }
}