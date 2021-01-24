<template>
  <div class="notPermission" id="notPermission">
    <div class="content">
      <img src="/static/images/other/404.svg" />
      <p>抱歉，您暂无权限访问该页面！</p>
      <div class="btn">
        <el-button type="primary" size="mini" plain @click="toIndex" style="margin-right: 25px">返回首页</el-button>
        <el-button type="primary" size="mini" @click="goBack">返回上一级</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'notPermission',
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    toIndex() {
      this.$router.push('/')
    },
  }
}
</script>

<style lang="scss" scoped>
.notPermission {
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      padding-bottom: 3vh;
    }
    p {
      font-size: 24px;
      margin-bottom: 10px;
      font-weight: 600;
    }
    span {
      color: #707070;
    }
    .btn {
      margin-top: 20px;
      .el-button {
        margin-top: 10px;
        padding-left: 20px;
        padding-right: 20px;
        font-size: 12px;
      }
    }
  }
}
</style>