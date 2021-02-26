<template>
  <div class='P_addProduct'>
    <el-dialog 
      :title="title"
      :visible.sync="show"
      :close-on-click-modal="false"
      width="580px"
      @close="onCancel">
      <el-form :model="form" :rules="rules" ref="form" label-width="110px">
        <el-form-item prop="simpleEnglishName" label = "产品英文简称：">
          <el-input v-model="form.simpleEnglishName" :disabled="type === 'modify'"></el-input>  
        </el-form-item>  
        <el-form-item prop="fullEnglishName" label = "产品英文全称：">
          <el-input v-model="form.fullEnglishName"></el-input>  
        </el-form-item>  
        <el-form-item prop="fullChineseName" label = "产品中文名称：">
          <el-input v-model="form.fullChineseName"></el-input>  
        </el-form-item>  
        <el-form-item prop="chargeMemberNames" label = "产品负责人：">
          <el-select v-model="form.chargeMemberNames" placeholder="请选择" multiple collapse-tags filterable>
            <el-option v-for="item in chargeMemberNamesList" :label="item.name" :value="item.value" :key="item.value"></el-option>  
          </el-select> 
        </el-form-item>  
        <el-form-item prop="productDesc" label = "产品介绍：">
          <el-input v-model="form.productDesc" type="textarea" :rows="5"></el-input>  
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
export default {
  props: ['isVisible', 'type', 'detail'],
  data () {
    let checkSimpleEnglishName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入产品英文简称'))
      } else if (!/^[A-Za-z ]+$/.test(value)) {
        callback(new Error('请输入正确的产品英文简称，只支持输入英文字母'))        
      } else if (value.length > 10) {
        callback(new Error('产品英文简称不能超过10字符大小'))
      } else {
        callback()
      }
    }
    let checkEnglishFull = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入产品英文全称'))
      } else if (!/^[A-Za-z ]+$/.test(value)) {
        callback(new Error('请输入正确的产品英文全称，只支持输入英文字母'))        
      } else if (value.length > 50) {
        callback(new Error('产品英文全称不能超过50字符大小'))
      } else {
        callback()
      }
    }
    let checkFullChineseName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入产品中文全称'))
      } else if (value.length > 50) {
        callback(new Error('产品中文全称不能超过50字符大小'))
      } else {
        callback()
      }
    }
    let checkProductDesc = (rule, value, callback) => {
      if (value.length > 200) {
        callback(new Error('产品说明不能超过200字符大小'))
      } else {
        callback()
      }
    }
    return {
      show: false,
      title: '新增产品',
      loading: false,
      form: {
        simpleEnglishName: '',
        fullEnglishName: '',
        fullChineseName: '',
        chargeMemberNames: [],
        productDesc: '',
      },
      rules: {
        simpleEnglishName: [
          { required: true, validator: checkSimpleEnglishName, trigger: 'blur' }
        ],
        fullEnglishName: [
          { required: true, validator: checkEnglishFull, trigger: 'blur' }
        ],
        fullChineseName: [
          { required: true, validator: checkFullChineseName, trigger: 'blur' }
        ],
        productDesc: [
          { validator: checkProductDesc, trigger: 'blur' }
        ],
      },
      chargeMemberNamesList: []
    }
  },
  mounted () {},
  destroyed() {
    this.$emit('update:isVisible', false)
  },  
  watch: {
    isVisible(val) {
      this.show = val
      if (val) {
        this.title = this.type == 'add' ? '新增产品' : '修改产品'
        if (this.type == 'update') {
          this.form.simpleEnglishName = this.detail.simpleEnglishName
          this.form.fullEnglishName = this.detail.fullEnglishName
          this.form.fullChineseName = this.detail.fullChineseName
          this.form.chargeMemberNames = this.detail.chargeMemberNames ? this.detail.chargeMemberNames.split(',') : []
          this.form.productDesc = this.detail.productDesc
        }
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let params = _.cloneDeep(this.form)
          params.chargeMemberNames = this.form.chargeMemberNames.join(',')
          if (this.type == 'add') {
            this.$$api_product_addProduct({
              data: params,
              fn: data => {
                this.$emit('refresh')
                this.$$SuccessMessage('新增成功！')
                this.onCancel()
                this.loading = false
              }
            })
          } else {
            params.id = this.detail.id
            this.$$api_product_updateProduct({
              data: params,
              fn: data => {
                this.$emit('refresh')
                this.$$SuccessMessage('修改成功！')
                this.onCancel()
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
        simpleEnglishName: '',
        fullEnglishName: '',
        fullChineseName: '',
        chargeMemberNames: [],
        productDesc: '',
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.P_addProduct {
  .el-form {
    overflow: hidden;
    .operation {
      margin-top: 10px;
      float: right;
    }
  }
}
</style>