<template>
  <div class='P_login' :style="winSize">
    <div class="lg_content box-justify">
      <div class="lg_content--left">
        <div class="lg_logo">
          <img src="" alt="">
        </div>
        <div class="lg_name">{{title}}</div>
      </div>
      <div class="lg-content--right">
        <el-form 
          label-position="left"
          label-width="0px"
          class="card-box"
          v-loading="login_actions.disabled"
          :model="data"
          :rules="rule_data"
          ref="data"
        >
          <h3 class="title">系统登录</h3>
          <el-form-item prop="userName">
            <el-input type="text" auto-complete="off" placeholder="请输入登录账户" v-model="data.userName"></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input name="login" type="password" auto-complete="off" placeholder="请输入登录密码" v-model="data.password" @keyup.native="checkCapslock"></el-input>
          </el-form-item>

          <p class="capslock" v-if="isCapslock">大写锁定已开启</p>

          <el-row v-if="isShowValidateCode">
            <el-col :span="16">
              <el-form-item prop="code">
                <el-input auto-complete="off" @keyup.native.enter="onLogin()" placeholder="请输入验证码" v-model.trim="data.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="base64Image">
              <p class="validateCodeImage" @click="refreshValidateCode">
                <img :src="base64Image" alt="">
              </p>
            </el-col>
          </el-row> 

          <el-form-item style="width: 280px; position: absolute; bottom: -10px;">
            <el-button type="primary" @click="onLogin()">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="copyright">
        <p>由XX金融技术提供技术支持</p>
      </div>
    </div>
  </div>
</template>

<script>
import LoginJs from './Login.js'
export default LoginJs
</script>

<style lang='scss' scoped>
$mainColor: #4183D7;
.P_login {
  overflow: hidden;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  .lg_content {
    margin: 0 auto;
  }
  .lg_content--left {
    margin-right: 130px;
    color: #fff;
    .lg_logo {
      margin-bottom: 24px;
      width: 280px;
    }
    .lg_name {
      font-size: 45px;
      font-weight: 600;
      letter-spacing: 2px;
    }
  }
  .lg-content--right {
    position: relative;
    .card-box {
      -webkit-box-shadow: 0 0px 8px rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
      box-shadow: 0px 0px 10px #333;
      background-clip: padding-box;
      background-color: #f9fafc;
      box-sizing: border-box;
      width: 320px;
      height: 350px;
      padding: 20px;
      .title {
        margin: 0px auto 40px auto;
        text-align: left;
        padding: 0px 10px;
        font-weight: 600;
        height: 18px;
        font-size: 18px;
        line-height: 18px;
        border-left: 3px solid $mainColor;
      }
      .capslock {
        position: absolute;
        top: 190px;
        right: 20px;
      }
    }
  }
  .copyright {
    width: 300px;
    font-size: 12px;
    color: #fff;
    margin: 0 auto;
    position: absolute;
    bottom: 40px;
    left: 50%;
    margin-left: -150px;
    text-align: center;
  }
}
</style>