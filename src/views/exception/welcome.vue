<template>
  <div class="welcome" id="welcome">
    <div class="content">
      <p>{{`欢迎使用${this.$store.state.user.name}`}}</p>
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
  },
}
</script>

<style lang="scss" scoped>
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('/static/images/welcome_bg.png');
  background-repeat: no-repeat;
  background-size: 100%;
  .content {
    position: absolute;
    bottom: 60%;
    width: 100%;
    background-color: #fff;
    text-align: center;
  }
  p {
    font-size: 30px;
    color: #4183d7;
  }
}
</style>