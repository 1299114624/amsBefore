<template>
  <div style="height: 100%;">
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.fade-enter-active,.fade-leave-active {
    transition: all .3s;
}
.fade-enter,.fade-leave-active {
    opacity: 0;
}
</style>