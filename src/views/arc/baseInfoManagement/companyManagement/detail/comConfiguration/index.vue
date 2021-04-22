<template>
  <div class='P_comConfiguration'>
    <div class="P_content">
      <div class="content__search">
        <el-button @click="handleAddClick" type="primary" style="margin: 8px">新增客户组件</el-button>
      </div>
      <div class="content__table">
        <el-table :data="list" stripe border height="100%" :empty-text="emptyText">
          <el-table-column align="center" label="组件名称" prop="componentName" sortable="custom" min-width="105"></el-table-column>
          <el-table-column align="center" label="组件英文全称" prop="componentEnglishName" min-width="105">
            <template slot-scope="{ row }">
              <auto-popover :popoverValue="row.componentEnglishName"></auto-popover>
            </template>          
          </el-table-column>
          <el-table-column align="center" label="开发语言" prop="languageType">
            <template slot-scope="scope">{{ AfFormatterListEnum('LanguageType', scope.row.languageType)}}</template>
          </el-table-column>
          <el-table-column align="center" label="组件说明" prop="description" min-width="160">
            <template slot-scope="{ row }">
              <auto-popover :popoverValue="row.description"></auto-popover>
            </template>           
          </el-table-column>
          <el-table-column align="center" label="组件类型" prop="componentTypeCn"></el-table-column>   
          <el-table-column align="center" label="设计文档SVN地址" prop="designSvnAddress" min-width="130"></el-table-column>
          <el-table-column align="center" label="需求文档SVN地址" prop="requireSvnAddress" min-width="130"></el-table-column>
          <el-table-column align="center" label="创建时间" prop="addTime" min-width="130"></el-table-column>
          <el-table-column align="center" label="最新修改时间" prop="updateTime" sortable="custom" min-width="130"></el-table-column>
          <el-table-column label="操作" fixed="right" width="60" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handleUpdate(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>        
      </div>
      <el-pagination
        class="content__page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNumber"
        :page-sizes.sync="pageSizes"
        :page-size.sync="pageSize"
        :layout="paginationLayout"
        :total.sync="totalCount"
      ></el-pagination>      
    </div>
    <el-dialog 
      title="新增组件"
      :visible.sync="showAddDialog"
      @close="onCancel"
      :close-on-click-modal="false"
      width="580px">

    </el-dialog>
  </div>
</template>

<script>
import { baseTableMixin, resizeMixin } from 'mixins'
export default {
  mixins: [baseTableMixin, resizeMixin],
  props: ['productId'],
  data () {
    return {
      queryParameters: {},
      list: [],
      showAddDialog: false,
    }
  },
  mounted () {
  },
  methods: {
    query() {
      // this.loadingData = true
      this.$$api_company_getComByProduct({
        data: this.$$GET_COMMON_QUERY_PARAM(
          this.queryParameters,
          this.pageNumber,
          this.pageSize,
          this.sortKey,
          this.sortType
        ),
        fn: data =>{
          this.list = data.list
          this.totalCount = data.total
        }
      })
    },    
    handleAddClick() {},
  }
}
</script>

<style lang='scss' scoped>
.P_comConfiguration {
  height: 100%;
}
</style>