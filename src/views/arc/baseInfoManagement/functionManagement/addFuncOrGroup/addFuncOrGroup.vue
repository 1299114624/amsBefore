<template>
  <div class='P_AddFuncOrGroup ml-15' :class="{'width-20': hidden}">
    <div class="icon-wrap pointer" @click="toggleHidden">
      <i class="f-16" :class="hidden ? 'el-icon-caret-left' : 'el-icon-caret-right'"></i>
    </div>
    <div class="detail" v-show="!hidden">
      <div class="detail-title">{{title}}</div>
      <div class="detail-inner">
        <div class="detail-type">所属类别：<span>{{ selectedNode.name }}</span></div>
        <el-radio-group v-model="radio" size="mini" v-if="type=='addFuncOrGroup'">
          <el-radio-button v-if="addType == 0 || addType == 2" label="0">功能</el-radio-button>
          <el-radio-button v-if="addType == 1 || addType == 2" label="1">分组</el-radio-button>
        </el-radio-group>
      </div>
      <div class="detail-content">
        <addFunction v-if="radio==0" :radio="radio" :type="type" :selectedNode="selectedNode" @refresh="refresh" @close="close"></addFunction>
        <addGroup v-if="radio==1" :radio="radio" :type="type" :selectedNode="selectedNode" @refresh="refresh" @close="close"></addGroup>
      </div>
    </div>
  </div>
</template>

<script>
import addFunction from './func/addFunction'
import addGroup from './group/addGroup'
export default {
  props: ['selectedNode', 'type', 'treeList'],
  components: {
    addFunction,
    addGroup,
  },
  data () {
    return {
      hidden: false,
      radio: null,
      showFunction: true,
      showGroup: true,
      addType: '',
      title: '新增功能/分组',
    }
  },
  watch: {
    selectedNode() {
      this.checkAddType()
    },
    type() {
      this.checkAddType()
    }
  },
  mounted () {
    this.checkAddType()
  },
  methods: {
    checkAddType() {
      if(this.type == 'updateGroup') {
        this.title = '修改分组'
        this.radio = 1
      } else if (this.type == 'updateFunction') {
        this.title = '修改功能'
        this.radio = 0
      } else {
        this.$$api_functionGroup_checkAddType({
          restParam: {
            id: this.selectedNode.node.id
          },
          fn: data => {
            this.addType = data
            switch (this.addType) {
              case 0: // 只能加功能
                this.radio = 0  
                break
              case 1: // 只能加分组
                this.radio = 1  
                break
              case 2: // 能加功能获分组
                this.radio = 0  
                break
            }
          },             
        })

      }   
    },
    toggleHidden() {
      this.hidden = !this.hidden
    },
    refresh() {
      this.$emit("refresh")
    },    
    close() {
      this.$emit("close")
    },    
  }
}
</script>

<style lang='scss' scoped>
$--color-gray: #ddd !default;
.P_AddFuncOrGroup {
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
      .detail-type {
        line-height: 28px;
      }
      .el-radio-group {
        margin-bottom: 10px;
      }    
    }
    .detail-content {
      flex: 1;
      padding-left: 20px;
      padding-right: 20px;      
      height: calc(100% - 96px);
    }
  }
}
</style>