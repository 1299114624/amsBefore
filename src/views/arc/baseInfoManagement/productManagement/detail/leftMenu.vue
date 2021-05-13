<template>
  <div class='P_companyLeftMenu'>
    <el-menu 
      :default-active="defaultActive"
      :collapse="false"
      @select="selectMenu">
      <el-menu-item v-for="(item, index) in menuList" :key="index" :index="item.index">
        <template slot="title">
          <span class="plain-ellipsis">{{ item.label }}</span>  
        </template>  
      </el-menu-item>  
    </el-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      defaultActive: '1',
      menuList: [
        {
          label: '功能配置',
          index: '1'
        },
        {
          label: '组件配置',
          index: '2'
        },
      ]
    }
  },
  methods: {
    selectMenu(index) {
      this.$emit('changeTableList', index)
    }
  }
}
</script>

<style lang='scss' scoped>
.P_companyLeftMenu {
  height: 100%;
  .el-menu-item.is-active {
    border-right: 2px solid #409eff;
    background-color: #ecf5ff;
  }
}
</style>