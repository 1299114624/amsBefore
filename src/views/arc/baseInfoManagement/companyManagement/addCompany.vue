<template>
  <div class='P_addCompany'>
    <el-dialog 
      :title="title"
      :visible.sync="show"
      :close-on-click-modal="false"
      width="580px"
      @close="onCancel">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item prop="companyName" label = "公司全称：">
          <el-input v-model="form.companyName"></el-input>  
        </el-form-item>  
        <el-form-item prop="simpleCompanyName" label = "公司简称：">
          <el-input v-model="form.simpleCompanyName"></el-input>  
        </el-form-item>    
        <el-form-item prop="englishCompanyName" label = "公司英文名称：">
          <el-input v-model="form.englishCompanyName"></el-input>  
        </el-form-item>         
        <el-form-item prop="productIdList" label = "所需产品：">
          <el-checkbox-group v-model="form.productIdList">
            <el-checkbox
              v-for="(item,index) in allProducts"
              :key="index"
              :label="item.id"
            >{{item.simpleEnglishName}}</el-checkbox>  
          </el-checkbox-group> 
        </el-form-item>         
        <el-form-item prop="description" label = "备注：">
          <el-input v-model="form.description" type="textarea" :rows="5"></el-input>  
        </el-form-item>  
        <p class="operation">
          <el-button size="small" type="primary" :loading="loading" @click="onSubmit">确 定</el-button>  
          <el-button size="small" @click="onCancel">取 消</el-button>  
        </p>       
      </el-form>  
    </el-dialog>
  </div>
</template>

<script>
import { validate } from 'utils'
export default {
  props: ['isVisible', 'type', 'detail'],
  data () {
    let checkCompanyName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入公司全称'))
      } else if (/^ +$/gi.test(value)) {
        callback(new Error('公司全称不能为纯空格'))
      } else if (value.length > 50) {
        callback(new Error('公司全称不能超过30字符大小'))
      } else {
        callback()
      }
    }
    let checkSimpleCompanyName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入公司简称'))
      } else if (/^ +$/gi.test(value)) {
        callback(new Error('公司简称不能为纯空格'))
      } else if (value.length > 50) {
        callback(new Error('公司简称不能超过50字符大小'))
      } else {
        callback()
      }
    }
    let checkEnglishCompanyName= (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入公司英文名称'))
      } else if (!validate.englishName_reg(value)) {
        callback(new Error('公司英文名称只支持输入英文字母和特殊符号'))
      } else if (value.length > 50) {
        callback(new Error('公司英文名称不能超过50字符大小'))
      } else {
        callback()
      }
    }
    let checkCompanyDesc = (rule, value, callback) => {
      if (value.length > 200) {
        callback(new Error('公司说明不能超过200字符大小'))
      } else {
        callback()
      }
    }
    return {
      show: false,
      title: '新增客户信息',
      loading: false,
      form: {
        companyName: '',
        simpleCompanyName: '',
        englishCompanyName: '',
        productIdList: [],
        description: '',
      },
      rules: {
        companyName: [{ required: true, validator: checkCompanyName, trigger: 'blur' }],
        simpleCompanyName: [{ required: true, validator: checkSimpleCompanyName, trigger: 'blur' }],
        englishCompanyName: [{ required: true, validator: checkEnglishCompanyName, trigger: 'blur' }],
        description: [{ validator: checkCompanyDesc, trigger: 'blur' }],
      },
      chargeMemberNamesList: [],
      allProducts: [],
    }
  },
  mounted () {
  },
  destroyed() {
    this.$emit('update:isVisible', false)
  },  
  watch: {
    isVisible(val) {
      this.show = val
      if (val) {
        this.title = this.type == 'add' ? '新增客户信息' : '修改客户信息'
        if (this.type == 'update') {
          this.form.companyName = this.detail.companyName
          this.form.simpleCompanyName = this.detail.simpleCompanyName
          this.form.englishCompanyName = this.detail.englishCompanyName
          this.form.productIdList = this.detail.products ? this.detail.products.map(v => {return v.id}) : []
          this.form.description = this.detail.description
        }
        this.getProductList()
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let params = _.cloneDeep(this.form)
          if (this.type == 'add') {
            this.$$api_company_addCompany({
              data: params,
              fn: data => {
                this.$emit('refresh')
                this.$$SuccessMessage('新增成功！')
                this.onCancel()
                this.loading = false
              },
              errFn: error => {
                this.$$ErrorMessage(error.msg)
                this.loading = false
              }
            })
          } else {
            params.id = this.detail.id
            this.$$api_company_updateCompany({
              data: params,
              fn: data => {
                this.$emit('refresh')
                this.$$SuccessMessage('修改成功！')
                this.onCancel()
                this.loading = false
              },
              errFn: error => {
                this.$$ErrorMessage(error.msg)
                this.loading = false
              }              
            })
          }
        }
      })
    },
    onCancel() {
      this.$emit('update:isVisible', false)
      this.$refs.form.resetFields()
      this.form = {
        companyName: '',
        simpleCompanyName: '',
        englishCompanyName: '',
        productIdList: [],
        description: '',
      }
    },
    getProductList() {
      this.$$api_product_getProductList({
        data: this.$$GET_COMMON_QUERY_PARAM(
          this.queryParameters,
          this.pageNumber,
          this.pageSize,
          this.sortKey,
          this.sortType
        ),
        fn: data =>{
          this.allProducts = data
        }
      })      
    }
  }
}
</script>

<style lang='scss' scoped>
.P_addCompany {
  .el-form {
    overflow: hidden;
    .operation {
      margin-top: 10px;
      float: right;
    }
    /deep/ .isForceRequired .el-form-item__label {
      &::before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
      }
    }
  }
}
</style>