<template>
  <div class="P_Company P_content">
    <div class="content__search">
      <form-query
        ref="formQuery"
        :SampleFields='sampleFields'
        :Fields='fields'
        :DefaultValue='defaultValue'
        @onSubmit='onSubmit'
      >
        <template slot="prefix">
          <el-button class="ml-10" type="primary" @click="handleAdd">新增客户</el-button>
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
        <el-table-column align="center" label="公司全称" prop="companyName" sortable="custom" min-width="140"></el-table-column>
        <el-table-column align="center" label="公司简称" prop="simpleCompanyName"></el-table-column>
        <el-table-column align="center" label="公司英文名称" prop="englishCompanyName" min-width="180"></el-table-column>
        <el-table-column align="center" label="已选产品" prop="productNames">
          <template slot-scope="{ row }">
            <auto-popover :popoverValue="row.productNames"></auto-popover>
          </template>                
        </el-table-column>
        <el-table-column align="center" label="备注" prop="description">
          <template slot-scope="{ row }">
            <auto-popover :popoverValue="row.description"></auto-popover>
          </template>           
        </el-table-column>
        <el-table-column align="center" label="添加时间" prop="addTime" min-width="130"></el-table-column>
        <el-table-column align="center" label="最新修改时间" prop="updateTime" sortable="custom" min-width="130"></el-table-column>
        <el-table-column label="操作" fixed="right" width="120" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button type="text" @click="handleSet(scope.row)">配置</el-button>
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
    <addCompany
      :isVisible.sync="showAddCompany"
      :type="type"  
      :detail="detail"  
      @refresh="refresh"
    ></addCompany>
  </div>
</template>

<script>
import { baseTableMixin, resizeMixin } from 'mixins'
import addCompany from './addCompany'
import {getPageNumber} from 'utils/utils/index.js'
export default {
  mixins: [baseTableMixin, resizeMixin],
  components: {
    addCompany
  },
  data() {
    return {
      list: [],
      sampleFields:[
        {
          type: 'input',
          key: 'companyName',
          label: '公司全称：',
          desc: '请输入',
          attrs: {
            clearable: true
          }
        },       
      ],
      fields:[                
      ],
      defaultValue: {},
      pageSize: 50,
      selectIds: [],
      showAddCompany: false,
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
      this.$$api_company_getCompanyPage({
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
    handleAdd() {
      this.showAddCompany = true
      this.type = 'add'
    },
    handleUpdate(detail) {
      this.showAddCompany = true
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
        this.$$api_company_deleteCompany({
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
    handleSet({id, companyName, simpleCompanyName}) {
      this.$router.push({
        name: `companyManagementDetail`,
        query: {
          id: id,
          companyName: companyName,
          simpleCompanyName: simpleCompanyName,
        }
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
.P_Company {
  height: 100%;
}
</style>