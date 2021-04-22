<template>
  <div class="P_functionManagement">
    <div class="header-search p-10">
      <div class="search-wrap">
        <el-input placeholder="请输入功能编号/功能名称" v-model="filterText">
          <i slot="suffix" class="el-icon-search mr-5 pointer"></i>
        </el-input>
      </div>
    </div>
    <div class="content">
      <div class="leftContent">
        <p class="functionTitle">
          <i class="el-icon-guide" style="color: #409eff"></i>
          功能清单
        </p>
        <div class="el-scrollbar">
          <div class="content__info" v-loading="loading" element-loading-text="数据加载中...">
            <el-tree
              ref="tree"
              :data="treeData"
              highlight-current
              default-expand-all
              node-key="name"
              :expand-on-click-node="false"
              :props="treeProps"
              :filter-node-method="filterNode"
              @node-click="handleNodeClick"
            >
              <span class="info__tree-node" slot-scope="{ node, data }">
                <span class="node__label" :class="{'group__node': data.node.groupName}">
                  {{ data.name }}
                </span>
                <template v-if="data.node.companyNames">
                  <span class="operate_tag f-12" v-for="item in data.node.companyNamesArr" :key="item">{{item.slice(0,2)}}</span>
                </template>
                <template>
                  <div class="tree-icons">
                    <i class="el-icon-plus f-16 ml-10" v-if="data.node.groupName" @click.stop="handleAddNode(data, node)"></i>
                    <template v-if="data.parentCode != '0'">
                      <i class="el-icon-edit f-16 ml-10" @click.stop="handleEditNode(data, node)"></i>
                      <i class="el-icon-close f-16 ml-10" @click.stop="handleDeleteNode(data, node)"></i>
                    </template>
                  </div>
                </template>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
      <div class="rightContent">
        <addFuncOrGroup v-if="type =='addFuncOrGroup' || type =='updateGroup' || type =='updateFunction'" 
        :type="type" :selectedNode="selectedNode" :treeList="treeList" @refresh="refresh" @close="close"></addFuncOrGroup>
        <functionDetail v-if="type =='functionDetail'" :selectedNode="selectedNode"></functionDetail>
        <groupDetail v-if="type =='groupDetail'" :selectedNode="selectedNode"></groupDetail>
      </div>
    </div>
  </div>
</template>

<script>
import addFuncOrGroup from './addFuncOrGroup/addFuncOrGroup'
import functionDetail from './addFuncOrGroup/func/functionDetail'
import groupDetail from './addFuncOrGroup/group/groupDetail'
export default {
  components: {
    addFuncOrGroup,
    functionDetail,
    groupDetail,
  },
  data() {
    return {
      filterText: "",
      loading: false,
      treeData: [],
      selectedNode: {},
      type: '',
      treeProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted() {
    this.query()
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    query() {
      this.$$api_functionGroup_getFunctionGroupTree({
        data: this.$$GET_COMMON_QUERY_PARAM(
          this.queryParameters,
          this.pageNumber,
          this.pageSize,
          this.sortKey,
          this.sortType
        ),
        fn: data =>{
          this.treeData = data
          this.treeList = this.getTreeList(data)
        }
      })      
    },
    handleNodeClick(data, node) {      
      if (data.node.groupName) {
        this.type = 'groupDetail'      
      } else {
        this.type = 'functionDetail'              
      }     
      this.selectedNode = data   
    },
    handleAddNode(data, node) {
      this.type = 'addFuncOrGroup'
      this.selectedNode = data
    },
    handleEditNode(data, node) {
      if (data.node.groupName) {
        this.type = 'updateGroup'      
      } else {
        this.type = 'updateFunction'              
      }
      this.selectedNode = data
    },
    handleDeleteNode(data, node) {
      if (data.node.groupName) {
        this.handleDeleteGroup(data)      
      } else {
        this.handleDeleteFunction(data)               
      }      
    },
    handleDeleteGroup(data) {
      if (data.children && data.children.length > 0) {
        this.$$ErrorMessage("请先删除分组下所有的分组及功能！")
        return
      }
      this.$confirm("确认删除该分组吗？", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$$api_functionGroup_deleteFunctionGroup({
          restParam: {
            id: data.node.id
          },
          fn: data =>{
            this.refresh()
            this.$$SuccessMessage("删除成功！")
          }
        })         
      })
    },
    handleDeleteFunction(data) {
      this.$confirm('确认删除该功能吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$$api_functionGroup_deleteFunction({
          restParam: {
            id: data.node.id
          },
          fn: data =>{
            this.refresh()
            this.$$SuccessMessage("删除成功！")
          }
        })         
      })
    },
    getTreeList(data) {
      let treeList = []
      function getDeepTree(data) {
        data.forEach(v => {
          treeList = treeList.concat(v)
          if(v.children) {
            getDeepTree(v.children)
          }
        })
      }
      getDeepTree(data)
      return treeList
    },
    filterNode(value, data) {
      if (!value) return true
      return (data.name.indexOf(value) !== -1) || (data.code.indexOf(value) !== -1)
    },
    refresh() {
      this.close()
      this.query()
    },
    close() {
      this.type = ''
    },
  }
}
</script>

<style lang="scss" scoped>
$--color-gray: #ddd !default;
.P_functionManagement {
  height: 100%;
  .header-search {
    border-bottom: 5px solid $--color-gray;
    .search-wrap {
      width: 300px;
      .el-icon-search {
        font-size: 16px;
        transform: translateY(50%);
        margin-top: -50%;
      }
    }
  }
  .content {
    height: calc(100% - 53px);
    display: flex;
    .leftContent {
      width: 40%;
      .functionTitle {
        font-size: 16px;
        padding: 6px;
        height: 34px;
      }
      .el-scrollbar {
        height: calc(100% - 34px);
        overflow: hidden;
        &:hover,
        &:active,
        &:focus {
          opacity: 1;
          transition: opacity 340ms ease-out;
          overflow-y: scroll;
        }      
        .content__info {
          margin-left: 20px;
          .info__tree-node {
            width: 100%;
            &:hover {
              background: #eef9fe;
              .tree-icons {
                visibility: visible;
              }
            }
            .node__label {
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: 14px;
              color: rgb(62, 61, 61);
              &.group__node {
                color: rgb(119, 121, 153);
              }
            }
            .tree-icons {
              visibility: hidden;
              display: inline-block;
              .el-icon-plus, .el-icon-edit {
                color: #409eff;
              }
              .el-icon-close {
                color: #fe5050;
              }
            }
          }
        }
      }
    }
    .rightContent {
      flex: 1;
    }
  }
}
</style>