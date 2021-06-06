<template>
  <div class='P_productManagement'>
    <header class="product__header">
      <i class="el-icon-back" @click="goBack"></i>
      <span class="currentProduct">当前产品：{{ $route.query.productName }}</span>
    </header>
    <div class="flexbox">
      <div class="left">
        <leftMenu @changeTableList="changeTableList"></leftMenu>
      </div>
      <div class="right">
        <funcConfiguration 
          ref="funcConfig"
          v-if="showIndex === '1'"
        ></funcConfiguration>
        <comConfiguration 
          ref="comConfig"
          v-if="showIndex === '2'"
        ></comConfiguration>
      </div>
    </div>
  </div>
</template>

<script>
import leftMenu from './leftMenu'
import funcConfiguration from './funcConfiguration'
import comConfiguration from './comConfiguration'
export default {
  components: {
    leftMenu,
    funcConfiguration,
    comConfiguration,
  },
  data () {
    return {
      showIndex: '1',
      productList: [],
    }
  },
  mounted () {
  },
  methods: {
    changeTableList(index) {
      this.showIndex = index
    },
    goBack() {
      this.$router.push({
        name: 'productManagement',
      })
    },
  }
}
</script>

<style lang='scss' scoped>
.P_productManagement {
  height: 100%;
  .product__header {
    height: 46px;
    line-height: 42px;
    border-bottom: 4px solid #ddd;
    padding-left: 10px;
    .el-icon-back {
      font-weight: bold;
      cursor: pointer;
      padding-right: 5px;
      color: #409EFF;
    }
    .currentProduct, .curentProduct {
      display: inline-block;
      margin-left: 20px;
      font-size: 14px;
    }
  }
  .flexbox {
    height: 100%;
    .left {
      width: 200px;
      height: calc(100% - 46px);
      border-right: 3px solid #dbdbdb;
    }
    .right {
      flex: 1;
      height: calc(100% - 46px);
    }
  }
}
</style>