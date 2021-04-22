<template>
  <div class='P_GroupDetail ml-15' :class="{'width-20': hidden}">
    <div class="icon-wrap pointer" @click="toggleHidden">
      <i class="f-16" :class="hidden ? 'el-icon-caret-left' : 'el-icon-caret-right'"></i>
    </div>
    <div class="detail" v-show="!hidden">
      <div class="detail-title">功能分组详情</div>
      <div class="detail-inner">
        <p>分组名称：{{this.selectedNode.node.groupName}}</p>
        <div class="flexbox"><div style="min-width:60px">分组描述：</div><el-input v-model="this.selectedNode.node.groupDesc" class="remark" type="textarea" :rows="4" disabled></el-input></div>
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
    }
  },
  mounted () {},
  methods: {
    toggleHidden() {
      this.hidden = !this.hidden
    },
  }
}
</script>

<style lang='scss' scoped>
$--color-gray: #ddd !default;
.P_GroupDetail {
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