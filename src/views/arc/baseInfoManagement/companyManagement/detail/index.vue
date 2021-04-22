<template>
  <div class='P_companyManagement'>
    <header class="company__header">
      <i class="el-icon-back" @click="goBack"></i>
      <span class="currentCompany">当前客户：{{ $route.query.companyName }}</span>
      <span class="curentProduct">
        <span>当前产品：</span>
        <el-select v-model="productId" @change="selectProduct" placeholder="请选择产品">
          <el-option v-for="item in productList" :key="item.id" :label="item.simpleEnglishName" :value="item.id"></el-option>
        </el-select>
      </span>
    </header>
    <div class="flexbox">
      <div class="left">
        <leftMenu @changeTableList="changeTableList"></leftMenu>
      </div>
      <div class="right">
        <funcConfiguration 
          ref="funcConfig" 
          v-if="showIndex === '1'"
          :productId="productId"
        ></funcConfiguration>
        <comConfiguration 
          ref="comConfig" 
          v-if="showIndex === '2'"
          :productId="productId"
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
      productId: ''
    }
  },
  mounted () {
    let id = this.$route.query.id
    this.getProductList(id)
  },
  methods: {
    getProductList(id) {
      this.$$api_product_getProductListByCompanyId({
        restParam: {
          id
        },
        fn: data =>{
          if (!data.length) {
            this.$message({
              showClose: true,
              message: '当前客户下暂无产品！',
              type: 'warning'
            })
            return
          }
          this.productList = data
          this.productId = data[0].id
          this.$refs.funcConfig.query()
        }
      })
    },
    selectProduct() {
      if (this.showIndex == '1') {
        this.$refs.funcConfig.query()
      } else {
        this.$refs.comConfig.query()
      }
    },
    changeTableList(index) {
      this.showIndex = index
      this.selectProduct()
    },
    goBack() {
      this.$router.push({
        name: 'companyManagement',
      })
    },
  }
}
</script>

<style lang='scss' scoped>
.P_companyManagement {
  height: 100%;
  .company__header {
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
    .currentCompany, .curentProduct {
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