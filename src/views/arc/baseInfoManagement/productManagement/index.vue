<template>
  <div class="P_product P_content">
    <div class="content__search">
      <!-- <el-button type="primary" @click="handleAddProduct('add')" class="ml-10">新增产品</el-button> -->
      <form-query
        ref="formQuery"
        :SampleFields='sampleFields'
        :Fields='fields'
        :DefaultValue='defaultValue'
        @onSubmit='onSubmit'
      >
        <template slot="prefix">
          <el-button class="ml-10" type="primary">新增</el-button>
          <el-button class="mr-10">删除</el-button>
        </template>
        <el-button slot="suffix" type="text" @click="handleExport">
          <i class="iconfont icon-daochu"></i>导出
        </el-button>
      </form-query>
    </div>
    <div class="content__table">
      <el-table :data="list" stripe border height="100%">
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
        <el-table-column align="center" label="最新修改时间" prop="updateTime" min-width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="handleModifyProduct('modify',scope.row)">修改</el-button>
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
    <addProduct
      :isVisible.sync="showAddProduct"
      :type="type"  
      :detail="detail"  
      @refresh="onSubmit"
    ></addProduct>
  </div>
</template>

<script>
import { baseTableMixin, resizeMixin } from 'mixins'
import addProduct from './addProduct'
export default {
  mixins: [baseTableMixin, resizeMixin],
  components: {
    addProduct
  },
  data() {
    return {
      list: [],
      sampleFields:[
        {
          type: 'input',
          key: 'questionTitle',
          label: '问题标题：',
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
          custom_attrs: {label:'name1',value:'value'},
          list: [
            {name1: '叶硕强',value: "1"},
            {name1: '李廷',value: "2"},
            {name1: '魏伯阳',value: "3"},
          ],
          attrs: {
            filterable: true
          }
        },
        {
          type: 'selectMultiple',
          key: 'groupMul',
          label: '负责小组：',
          desc: '请选择',
          custom_attrs: {label:'name1',value:'value'},
          list: [
            {name1: '叶硕强',value: "1"},
            {name1: '李廷',value: "2"},
            {name1: '魏伯阳',value: "3"},
          ],
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
    handleAddProduct(type, detail) {
      this.showAddProduct = true
      this.type = type
      this.detail = detail
    },
    handleExport(){},
  }
}
</script>

<style lang="scss" scoped>
.P_product {
  height: 100%;
}
</style>