<template>
  <div class='P_FuncConfiguration'>
    <div class="leftContent">
      <el-scrollbar>
        <el-tree
          :expand-on-click-node="false"
          :data="treeData"
          :highlight-current="true"
          node-key="id"
          :props="defaultTreeProps"
          :default-expand-all="true"
          @node-click="handleNodeClick"
        >
          <div class="info__tree-node" slot-scope="{ data, node }">
            <span class="node__label f-16" :class="{'group__node': data.code == '0' || data.node.groupName}">
              {{ data.name }}
            </span>
            <span class="operate__item ml-10" v-if=" data.code == '0'">
              <i class="el-icon-plus f-16" @click.stop.prevent="handleAddNode(data, node)"></i>
            </span>
            <span class="operate__item ml-10" v-else>
              <i class="el-icon-close f-16" @click.stop.prevent="handleDelete(data, node)"></i>
            </span>
          </div>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="rightContent">
      <funcDetail
        v-if="showType == 'funcDetail'"
        ref="funcDetail"
        :selectedNode="selectedNode"
        :productId="productId"
      ></funcDetail>
      <addProductFunction
        v-else-if="showType == 'addProFunc'"
        ref="addProFunc"
        :selectedNode="selectedNode"
        :productId="productId"
        :parentNode="parentNode"
        @close="closeProFunc"
        @refresh="query"
      ></addProductFunction>
    </div>
  </div>
</template>

<script>
import addProductFunction from './addProductFunction'
import funcDetail from './funcDetail'
export default {
  mixins: [],
  components: {
    addProductFunction,
    funcDetail
  },
  data () {
    return {
      treeData: [],
      defaultTreeProps: {
        children: 'children',
        label: 'name'
      },
      productId: '',
      showType: '',
      selectedNode: {},
      parentNode: {},
    }
  },
  mounted () {
    this.productId = this.$route.query.id
    this.query()
  },
  methods: {
    query() {
      this.$$api_product_getProductFunction({
        restParam: {
          id: this.productId
        },
        fn: data =>{
          this.treeData = data
        }
      })      
    },
    initNode(data, node) {
      this.parentNode = node.parent.data
      this.selectedNode = data
    },
    handleNodeClick(data, node) {
      if (data.code == '0') {
        this.showType = ''
        return
      }
      this.initNode(data, node)
      this.showType = 'funcDetail'
    },
    handleAddNode(data, node) {
      this.initNode(data, node)
      this.showType = 'addProFunc'
    },
    closeProFunc() {
      this.showType = ''
    },
    handleDelete() {},    
  }
}
</script>

<style lang='scss' scoped>
.P_FuncConfiguration {
  height: 100%;
  .leftContent {
    width: calc(100% - 580px);
    height: 100%;
    float: left;
    .info__tree-node {
      width: 100%;
      color: #3e3d3d;
      .group__node {
        color: #8c92ef;
      }
      .el-icon-plus {
        color: #409eff;
      }
      .el-icon-close {
        color: #fe5050;
      }
      .operate__item {
        visibility: hidden;
      }
      &:hover .operate__item {
        visibility: visible;
      }
      /deep/ .el-tree-node__content:hover {
        background: #eef9fe;
      }

    }
  }
  .rightContent {
    width: 580px;
    height: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>