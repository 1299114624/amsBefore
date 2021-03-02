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
            >
              <span class="info__tree-node" slot-scope="{ node, data }">
                <span class="node__label" :class="{'group__node': data.type== 2}">
                  {{ data.name }}
                </span>
                <template v-if="data.node.companyNames">
                  <span class="operate_tag f-12" v-for="item in data.node.companyNamesArr" :key="item">{{item.slice(0,2)}}</span>
                </template>
                <template>
                  <div class="tree-icons">
                    <i class="el-icon-plus f-16 ml-10" v-if="data.type== 2" @click="handleAddNode"></i>
                    <template v-if="data.parentCode != '0'">
                      <i class="el-icon-edit f-16 ml-10" @click="handleEditNode(data, node)"></i>
                      <i class="el-icon-close f-16 ml-10" @click="handleDeleteNode(data, node)"></i>
                    </template>
                  </div>
                </template>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filterText: "",
      loading: false,
      treeData: [],
      treeProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted() {
    this.query()
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
        }
      })      
    }
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
      width: 30%;
      .functionTitle {
        font-size: 16px;
        padding: 6px;
        height: 34px;
      }
      .el-scrollbar {
        height: calc(100% - 34px);
        .content__info {
          margin-left: 20px;
        }
      }
    }
    .righrContent {
      flex: 1;
    }
  }
}
</style>