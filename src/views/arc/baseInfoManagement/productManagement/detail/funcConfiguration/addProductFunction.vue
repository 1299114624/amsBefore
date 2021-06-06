<template>
  <div class='P_AddProFunc ml-15' :class="{'width-20': hidden}">
    <div class="icon-wrap pointer" @click="toggleHidden">
      <i class="f-16" :class="hidden ? 'el-icon-caret-left' : 'el-icon-caret-right'"></i>
    </div>
    <div class="detail" v-show="!hidden">
      <div class="detail-title">{{title}}</div>
      <div class="detail-inner">
        <span>功能：</span>
        <el-button size="small" :class="{'btnActive': showFunc}">功能</el-button>
      </div>
      <div class="detail-content">
        <diy-transfer
          :titles="['未选', '已选']"
          :treeData="treeData"
          :check-strictly="true"
          alias-label="componentName"
          ref="diyTransfer"
        >
          <span class="tag" slot="diyinfo">通用</span>
        </diy-transfer>
        <p class="operation">
          <el-button type="primary" :loading="sureLoading" size="small" @click="onSubmit">确 定</el-button>
          <el-button size="small" @click="onCancel">取 消</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import diyTransfer from '@/components/diyTransfer'
export default {
  props: [],
  components: {
    diyTransfer
  },  
  data () {
    return {
      hidden: false,
      showFunc: true,
      title: '添加子功能',
      sureLoading: false,
      treeData: [],
    }
  },
  watch: {
  },
  mounted () {
  },
  methods: {
    toggleHidden() {
      this.hidden = !this.hidden
    },
    refresh() {
      this.$emit("refresh")
    },    
    onSubmit() {
      let selected = this.$refs.diyTransfer.getCheckedNodes()
      if (!selected.length) {
        this.$message({
          showClose: true,
          message: '请至少添加一个组件！',
          type: 'warning'
        })
        return
      }
      this.sureLoading = true
      let submitData = []
      selected.forEach(item => {
        submitData.push({
          componentId: item.id,
          productId: this.productId
        })
      })
      this.$$api_product_addProductCom({
        data: submitData,
        fn: data =>{
          this.$$SuccessMessage('新增成功')
          this.onCancel()
          this.query()
          this.sureLoading = false
        },
        errFn(error) {
          this.sureLoading = false
          this.$$ErrorMessage(error.msg)
        }
      })       
    },
    onCancel() {
      this.$refs.diyTransfer.resetTransfer()
      this.$emit('close')
    },   
  }
}
</script>

<style lang='scss' scoped>
$--color-gray: #ddd !default;
.P_AddProFunc {
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
      line-height: 30px;
      padding:10px 0 10px 16px;
      .btnActive {
        background: #4183d7;
        color: #fff;
      }   
    }
    .detail-content {
      flex: 1;
      padding-left: 20px;
      padding-right: 20px;      
      height: calc(100% - 96px);
      .operation {
        position: absolute;
        bottom: 10px;
        right: 10px;
      }      
    }
  }
}
</style>