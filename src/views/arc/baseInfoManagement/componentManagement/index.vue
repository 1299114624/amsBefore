<template>
  <div class="P_Component P_content">
    <div class="content__search">
      <form-query
        ref="formQuery"
        :SampleFields='sampleFields'
        :Fields='fields'
        :DefaultValue='defaultValue'
        @onSubmit='onSubmit'
      >
        <template slot="prefix">
          <el-button class="ml-10" type="primary" @click="handleAdd">新增组件</el-button>
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
        <el-table-column align="center" label="所属客户" prop="companyNames">
          <template slot-scope="{ row }">
            <auto-popover :popoverValue="row.companyNames"></auto-popover>
          </template>             
        </el-table-column>
        <el-table-column align="center" label="被引用功能" prop="functionNames" min-width="95">
          <template slot-scope="{ row }">
            <auto-popover :popoverValue="row.functionNames"></auto-popover>
          </template>           
        </el-table-column>
        <el-table-column align="center" label="组件负责人" prop="chargeman" min-width="95">
          <template slot-scope="{ row }">
            <auto-popover :popoverValue="row.chargeman"></auto-popover>
          </template>              
        </el-table-column>        
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
    <addComponent
      :isVisible.sync="showAddComponent"
      :type="type"  
      :detail="detail"  
      @refresh="refresh"
    ></addComponent>
  </div>
</template>

<script>
import { baseTableMixin, resizeMixin } from 'mixins'
import addComponent from './addComponent'
import {getPageNumber} from 'utils/utils/index.js'
export default {
  mixins: [baseTableMixin, resizeMixin],
  components: {
    addComponent
  },
  data() {
    return {
      list: [],
      sampleFields:[
        {
          type: 'input',
          key: 'componentName',
          label: '组件名称：',
          desc: '请输入',
          attrs: {
            clearable: true
          }
        },
        {
          type: 'select',
          key: 'languageType',
          label: '开发语言：',
          desc: '请选择',
          enumcode: 'LanguageType',
          attrs: {
            filterable: true,
          }
        },        
      ],
      fields:[                
      ],
      defaultValue: {},
      pageSize: 50,
      selectIds: [],
      showAddComponent: false,
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
      this.$$api_component_getComponentPage({
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
      this.showAddComponent = true
      this.type = 'add'
    },
    handleUpdate(detail) {
      this.showAddComponent = true
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
        this.$$api_component_deleteComponent({
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
.P_Component {
  height: 100%;
}
</style>