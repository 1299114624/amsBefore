<template>
  <div class="welcome" id="welcome">
    <div class="content">
      <p>{{`欢迎使用${systemInfo.name}`}}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
export default {
  name: 'welcome',
  computed: {
    ...mapState({
      systemInfo: state => state.global.systemInfo
    })
  }
}
</script>

<style lang="scss" scoped>
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('~/static/images/other/welcome_bg.jpg');
  background-repeat: no-repeat;
  background-size: 100%;
  .content {
    position: absolute;
    bottom: 20%;
    width: calc(100% - 20px);
    background-color: #fff;
    text-align: center;
  }
  p {
    font-size: 30px;
    color: #4183d7;
  }
}
</style>