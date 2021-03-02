<template>
  <div class="P_product P_content">
    <div class="content__search">
      <form-query
        ref="formQuery"
        :SampleFields='sampleFields'
        :Fields='fields'
        :DefaultValue='defaultValue'
        @onSubmit='onSubmit'
      >
        <template slot="prefix">
          <el-button class="ml-10" type="primary" @click="handleAddProduct">新增产品</el-button>
          <el-button class="mr-10" type="danger" @click="deleteConfirm" :disabled="selectIds.length == 0" plain>删除</el-button>
        </template>
        <el-button slot="suffix" type="text" @click="handleExport">
          <i class="iconfont icon-daochu"></i>导出
        </el-button>
      </form-query>
    </div>
    <div class="content__table">
      <el-table :data="list" stripe border height="100%" :default-sort="{prop:'updateTime',order:'ascending'}" v-loading="loadingData" 
      :empty-text="emptyText" @selection-change="handleSelectionChange" @sort-change="tablesort">
        <el-table-column type="selection" width="27"></el-table-column>
        <el-table-column align="center" label="产品英文简称" prop="simpleEnglishName" min-width="150"></el-table-column>
        <el-table-column align="center" label="产品英文全称" prop="fullEnglishName" min-width="200">
          <template slot-scope="{ row }">
            <auto-popover :popoverValue="row.fullEnglishName"></auto-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" label="产品中文全称" prop="fullChineseName" min-width="200"></el-table-column>
        <el-table-column align="center" label="对应客户" prop="usedCompanyNames" min-width="200"></el-table-column>
        <el-table-column align="center" label="产品负责人" prop="chargeMemberNames" min-width="150"></el-table-column>
        <el-table-column align="center" label="产品介绍" prop="productDesc" min-width="250"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="addTime" min-width="150"></el-table-column>
        <el-table-column align="center" label="最新修改时间" prop="updateTime" min-width="150" sortable="custom"></el-table-column>
        <el-table-column label="操作" fixed="right" width="180" header-align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleUpdateProduct(scope.row)">修改</el-button>
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
</template>

<script>
import { baseTableMixin, resizeMixin } from 'mixins'
import {getPageNumber} from 'utils/utils/index.js'
export default {
  mixins: [baseTableMixin, resizeMixin],
  data() {
    return {
      list: [],
      sampleFields:[
        {
          type: 'input',
          key: 'simpleEnglishName',
          label: '产品英文简称：',
          desc: '请输入',
          attrs: {
            clearable: true
          }
        },
        {
          type: 'select',
          key: 'groupIds',
          label: '负责小组：',
          desc: '请选择',
          enumcode: 'QuestionType',
          attrs: {
            filterable: true
          }
        },
        {
          type: 'selectMultiple',
          key: 'groupMul',
          label: '负责小组：',
          desc: '请选择',
          enumcode: 'QuestionType',
          attrs: {
            filterable: true,
            'collapse-tags': true
          }
        },
      ],
      fields:[      
        {
          type: 'checkbox',
          key: 'checkbox',
          label: 'checkbox组件',
          list: [
            {name:'深圳',value:'1'},
            {name:'北京',value:'2'},
            {name:'上海',value:'3'},
          ]
        },    
        {
          type: 'date',
          key: 'date',
          label: 'date组件：',
          desc: '请输入',
          attrs: {
            'unlink-panels': true,
            'value-format': 'yyyy-MM-dd'
          }
        },            
        {
          type: 'daterange',
          key: 'daterange',
          label: 'daterange组件：',
          desc: '请输入',
          attrs: {
            'unlink-panels': true,
            'value-format': 'yyyy-MM-dd'
          }
        },            
      ],
      defaultValue: {},
      selectIds: [],
      showAddProduct: false,
      loadingData: false,
      type: '',
      detail: {},
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    onSubmit(val) {
      console.log(val)
      this.queryParameters = val.data
      this.pageNumber = 1
      this.query()
    },
    refresh() {
      this.pageNumber = 1
      this.query()
    },
    query() {
      // this.loadingData = true
      this.$$api_product_getProductPage({
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
          console.log(data)
        }
      })
    },
    handleAddProduct() {
      this.showAddProduct = true
      this.type = 'add'
    },
    handleUpdateProduct(detail) {
      this.showAddProduct = true
      this.type = 'update'
      this.detail = detail
    },
    handleExport(){},
    handleSelectionChange(val) {
      this.selectIds = val
    },
    deleteConfirm() {
      this.$confirm('确定删除吗?', "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = []
        for (let i = 0; i <= this.selectIds.length - 1; i++) {
          ids.push(this.selectIds[i].id)
        }
        this.$$api_product_deleteProduct({
          data: ids,
          fn: data =>{
            this.$$SuccessMessage('删除成功！')
            this.pageNumber = getPageNumber({
              list: this.list,
              deleteList: this.selectIds,
              totalCount: this.totalCount,
              pageNumber: this.pageNumber,
              pageSize: this.pageSize
            })
            this.query()
          }
        })        
      })
    },
    tablesort(column) {
      this.sortKey = column.prop
      this.sortType = column.order
      this.query()
    }
  }
}
</script>

<style lang="scss" scoped>
.P_product {
  height: 100%;
}
</style>