<template>
  <div class='P_FunctionDetail ml-15' :class="{'width-20': hidden}">
    <div class="icon-wrap pointer" @click="toggleHidden">
      <i class="f-16" :class="hidden ? 'el-icon-caret-left' : 'el-icon-caret-right'"></i>
    </div>
    <div class="detail" v-show="!hidden">
      <div class="detail-title">功能详情</div>
      <div class="detail-inner">
        <p>功能编号：{{this.selectedNode.node.functionCode}}</p>
        <p>功能名称：{{this.selectedNode.node.functionName}}</p>
        <p>功能类型：{{AfFormatterListEnum("FunctionType", this.selectedNode.node.functionType)}}</p>
        <p v-if="this.selectedNode.node.functionType == 1">所属客户：{{this.form.companyNames}}</p>
        <p>功能负责人：{{AfFormatterListUserName(this.selectedNode.node.chargeman)}}</p>
        <p>关联组件：{{this.form.componentNames}}</p>
        <p>添加时间：{{this.selectedNode.node.addTime}}</p>
        <p>修改时间：{{this.selectedNode.node.updateTime}}</p>
        <div class="flexbox"><div style="min-width:60px">功能说明：</div><el-input v-model="this.selectedNode.node.description" class="remark" type="textarea" :rows="4" disabled></el-input></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['selectedNode'],
  data () {
    return {
      hidden: false,
      form: {
        companyNames: '',
        componentNames: '',
      }
    }
  },
  mounted () {
    this.getFunctionById(this.selectedNode)
  },
  methods: {
    toggleHidden() {
      this.hidden = !this.hidden
    },
    getFunctionById(selectedNode) {
      this.$$api_functionGroup_getFunctionById({
        restParam: {
          id: selectedNode.node.id
        },
        fn: data => {
          this.form.companyNames = data.companyNames
          this.form.componentNames = data.componentNames
        },            
      })      
    },    
  }
}
</script>

<style lang='scss' scoped>
$--color-gray: #ddd !default;
.P_FunctionDetail {
  height: 100%;
  width: 100%;
  position: relative;
  border-left: 2px solid $--color-gray;
  float: right;
  .icon-wrap {
    width: 16px;
    height: 40px;
    line-height: 40px;
    position: absolute;
    top: 50%;
    background: #fff;
    transform: translate(-50%, -50%);
    color: #ccc;
    border: 1px solid $--color-gray;
    border-radius: 8px;
    z-index: 1000;
  }
  .detail {
    height: 100%;
    display: flex;
    flex-direction: column;
    .detail-title {
      height: 30px;
      line-height: 30px;
      background: #edeef5;
      font-size: 14px;
      padding-left: 20px;
    }  
    .detail-inner {
      padding-left: 20px;
      padding-right: 20px;
      line-height: 30px;
      /deep/ textarea {
        margin-top: 10px;
        background-color: #fff;
        color: #333 !important;
        cursor: default !important;
      }
    }
  }
}
</style>