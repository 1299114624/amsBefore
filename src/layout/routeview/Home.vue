<template>
  <div class="G_home">
      <head-nav/>
      <div class="G_occupy"></div>
      <div :class="['G_main', 'with-bread']">
          <bread/>
          <div class="G_content">
              <router-view/>
          </div>
      </div>
  </div>
</template>

<script>
import HeadNav from '../headNav/HeadNav'
import Bread from '../bread/Bread'
import { mapGetters, mapState } from 'vuex'
export default {
    name: 'home',
    components: {
        HeadNav,
        Bread
    },
}
</script>

<style lang="scss" scoped>
$stretch-transition: all 0.3s;
.G_occupy {
    margin-top: 50px;
}
.G_content {
    transition: $stretch-transition;
    .error-fixed {
        position: fixed;
        bottom: 40px;
        right: 20px;
        z-index: 9999;
    }
}
</style>