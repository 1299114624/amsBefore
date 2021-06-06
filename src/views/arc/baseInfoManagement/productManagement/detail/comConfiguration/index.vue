<template>
  <div class='P_comConfiguration'>
    <div class="P_content">
      <div class="content__search">
        <el-button @click="handleAddClick" type="primary" style="margin: 8px">新增产品组件</el-button>
      </div>
      <div class="content__table">
        <el-table :data="list" stripe border height="100%" :empty-text="emptyText">
          <el-table-column type="selection" width="27"></el-table-column>
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
          <el-table-column align="center" label="组件类型" prop="componentType">
            <template slot-scope="scope">{{ AfFormatterListEnum('ComponentType', scope.row.componentType + '')}}</template>              
          </el-table-column>   
          <el-table-column align="center" label="设计文档SVN地址" prop="designSvnAddress" min-width="130"></el-table-column>
          <el-table-column align="center" label="需求文档SVN地址" prop="requireSvnAddress" min-width="130"></el-table-column>
          <el-table-column align="center" label="创建时间" prop="addTime" min-width="130"></el-table-column>
          <el-table-column align="center" label="最新修改时间" prop="updateTime" sortable="custom" min-width="130"></el-table-column>
          <el-table-column label="操作" fixed="right" width="60" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteConfirm(scope.row)">删除</el-button>
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
    </el-dialog>
  </div>
</template>

<script>
import { baseTableMixin, resizeMixin } from 'mixins'
import diyTransfer from '@/components/diyTransfer'
import {getPageNumber} from 'utils/utils/index.js'
export default {
  mixins: [baseTableMixin, resizeMixin],
  components: {
    diyTransfer
  },
  data () {
    return {
      queryParameters: {},
      list: [],
      treeData: [],
      productName: '',
      showAddDialog: false,
      sureLoading: false,
    }
  },
  created () {
    this.productName = this.$route.query.productName  // 产品名称
    this.productId = this.$route.query.id
    this.queryParameters.productId = this.productId
  },
  mounted() {
    this.query()
  },
  methods: {
    query() {
      this.$$api_product_getProductCom({
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
    handleSelectionChange(val) {
      this.selectIds = val
    },    
    deleteConfirm(row) {
      this.$confirm('确定删除吗?', "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$$api_product_deleteProductComponent({
          restParam: {
            id: row.productComponentId + ''
          },
          fn: data =>{
            this.$$SuccessMessage('删除成功！')
            this.query()
          }
        })        
      })
    },     
    handleAddClick() {
      this.showAddDialog = true
      this.$$api_product_getDisProductCom({
        data: {
          productId: this.productId,
        },
        fn: data =>{
          this.treeData = data.map(e => {
            e.first = true
            return e
          })
        }
      })      
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
      this.showAddDialog = false
    },

  }
}
</script>

<style lang='scss' scoped>
.P_comConfiguration {
  height: 100%;
  .operation {
    margin-top: 10px;
    float: right;
  }
}
</style>