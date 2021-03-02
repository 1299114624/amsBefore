<template>
  <div class='P_addComponent'>
    <el-dialog 
      :title="title"
      :visible.sync="show"
      :close-on-click-modal="false"
      width="580px"
      @close="onCancel">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item prop="componentName" label = "组件名称：">
          <el-input v-model="form.componentName"></el-input>  
        </el-form-item>  
        <el-form-item prop="componentEnglishName" label = "组件英文名称：">
          <el-input v-model="form.componentEnglishName"></el-input>  
        </el-form-item>
        <el-form-item label="请选择组件类型：" class="isForceRequired">
          <el-row>
            <el-col :span="10" class="mr-20">
              <el-form-item prop="componentType" label-width="0">
                <el-select v-model="form.componentType" style="width:180px" clearable placeholder="请选择组件类型" :disabled="type == 'update'">
                  <el-option v-for="item in componentTypeList" :label="item.name" :value="item.value" :key="item.value"></el-option>  
                </el-select>            
              </el-form-item>
            </el-col>  
            <el-col :span="10" v-if="form.componentType === 1">
              <el-form-item prop="companys" label-width="0">
                <el-select v-model="form.companys" style="width:180px" placeholder="请选择所属客户" multiple collapse-tags> 
                  <el-option v-for="item in companyList" :label="item.companyName" :value="item.id" :key="item.id"></el-option>  
                </el-select>            
              </el-form-item>
            </el-col>  
          </el-row>  
        </el-form-item>
        <el-form-item prop="chargeman" label = "组件负责人：">
          <el-select v-model="form.chargeman" style="width:180px" placeholder="请选择" multiple collapse-tags filterable>
            <el-option v-for="item in chargemanList" :label="item.name" :value="item.value" :key="item.value"></el-option>  
          </el-select> 
        </el-form-item>  
        <el-form-item prop="languageType" label = "开发语言：">
          <el-select v-model="form.languageType" style="width:180px" clearable placeholder="请选择">
            <el-option v-for="item in languageTypeList" :label="item.name" :value="item.value" :key="item.value"></el-option>  
          </el-select> 
        </el-form-item>  
        <el-form-item prop="designSvnAddress" label = "设计文档SVN地址：">
          <el-input v-model="form.designSvnAddress"></el-input>  
        </el-form-item>          
        <el-form-item prop="requireSvnAddress" label = "需求文档SVN地址：">
          <el-input v-model="form.requireSvnAddress"></el-input>  
        </el-form-item>          
        <el-form-item prop="description" label = "组件说明：">
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
export default {
  props: ['isVisible', 'type', 'detail'],
  data () {
    let checkComponentName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入组件名称'))
      } else if (/^ +$/gi.test(value)) {
        callback(new Error('组件名称不能为纯空格'))
      } else if (value.length > 30) {
        callback(new Error('组件名称不能超过30字符大小'))
      } else {
        callback()
      }
    }
    let checkComponentDesc = (rule, value, callback) => {
      if (value.length > 200) {
        callback(new Error('组件说明不能超过200字符大小'))
      } else {
        callback()
      }
    }
    return {
      show: false,
      title: '新增组件',
      loading: false,
      form: {
        componentName: '',
        componentEnglishName: '',
        componentType: '',
        companys: [],
        chargeman: [],
        languageType: '',
        designSvnAddress: '',
        requireSvnAddress: '',
        description: '',
      },
      rules: {
        componentName: [{ required: true, validator: checkComponentName, trigger: 'blur' }],
        componentType: [{ required: true, message: '请选择组件类型', trigger: 'change' }],
        description: [{ validator: checkComponentDesc, trigger: 'blur' }],
      },
      componentTypeList: [
        {name: '通用组件', value: 0},
        {name: '客制组件', value: 1},
      ],
      companyList: [],
      chargemanList: [],
      languageTypeList: [],
    }
  },
  mounted () {
    this.languageTypeList = this.GetListEnum("LanguageType")
  },
  destroyed() {
    this.$emit('update:isVisible', false)
  },  
  watch: {
    isVisible(val) {
      this.show = val
      if (val) {
        this.title = this.type == 'add' ? '新增组件' : '修改组件'
        if (this.type == 'update') {
          this.form.componentName = this.detail.componentName
          this.form.componentEnglishName = this.detail.componentEnglishName
          this.form.componentType = this.detail.componentType
          this.form.companys = this.detail.companys ? this.detail.companys.split(',').map(v => parseInt(v)): []
          this.form.chargeman = this.detail.chargeman ? this.detail.chargeman.split(',') : []
          this.form.languageType = this.detail.languageType
          this.form.designSvnAddress = this.detail.designSvnAddress
          this.form.requireSvnAddress = this.detail.requireSvnAddress
          this.form.description = this.detail.description
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
          params.chargeman = this.form.chargeman.join(',')
          if (this.type == 'add') {
            this.$$api_component_addComponent({
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
            this.$$api_component_updateComponent({
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
        componentName: '',
        componentEnglishName: '',
        componentType: '',
        companys: [],
        chargeman: [],
        languageType: '',
        designSvnAddress: '',
        requireSvnAddress: '',
        description: '',
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.P_addComponent {
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