<template>
  <div class='P_addFunction'>
    <el-form :model="form" :rules="rules" ref="form" label-width="110px">
      <div class="box">
        <el-form-item prop="functionCode" label = "功能编号：">
          <el-input v-model="form.functionCode" placeholder="请输入"></el-input>  
        </el-form-item>  
        <el-form-item prop="functionName" label = "功能名称：">
          <el-input v-model="form.functionName" placeholder="请输入"></el-input>  
        </el-form-item>  
        <el-form-item label=" " label-width="0">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="functionType" label = "功能类型：">
                <el-select v-model="form.functionType" style="width:180px" placeholder="请选择功能类型" clearable disabled> 
                  <el-option v-for="item in functionTypeList" :label="item.name" :value="item.value" :key="item.value"></el-option>  
                </el-select>  
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.functionType == '1'">
              <el-form-item prop="companyIds" label=" " label-width="0">
                <el-select v-model="form.companyIds" style="width:180px" placeholder="请选择客户" multiple collapse-tags clearable> 
                  <el-option v-for="item in companyList" :label="item.companyName" :value="item.id" :key="item.id"></el-option>  
                </el-select>  
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item> 
        <el-form-item prop="chargeman" label = "功能负责人：">
          <el-select v-model="form.chargeman" style="width:180px" placeholder="请选择" multiple collapse-tags filterable>
            <el-option v-for="item in userList" :label="item.realName" :value="item.id" :key="item.id"></el-option>  
          </el-select> 
        </el-form-item>           
        <el-form-item prop="componentIds" label = "关联组件：">
          <el-select v-model="form.componentIds" style="width:180px" placeholder="请选择" multiple collapse-tags filterable>
            <el-option v-for="item in componentList" :label="item.componentName" :value="item.id" :key="item.id"></el-option>  
          </el-select> 
        </el-form-item>           
        <el-form-item prop="description" label = "功能描述：">
          <el-input v-model="form.description" placeholder="请输入" type="textarea" :rows="4"></el-input>  
        </el-form-item>
      </div>
    </el-form>  
    <p class="footer">
      <el-button size="small" type="primary" :loading="loading" @click="onSubmit">确 定</el-button>  
      <el-button size="small" @click="onCancel">取 消</el-button>  
    </p>       
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['radio', 'type', 'selectedNode'],
  data () {
    return {
      loading: false,
      form: {
        functionCode: '',
        functionName: '',
        functionType: this.selectedNode.node.groupType + '',
        companyIds: [],
        componentIds: [],
        chargeman: [],
        description: '',
      },
      rules: {
        functionCode: [{ required: true, message: '请输入功能编号', trigger: 'blur' }],
        functionName: [{ required: true, message: '请输入功能名称', trigger: 'blur' }],
        functionType: [{ required: true, message: '请选择功能类型', trigger: 'blur' }],
        companyIds: [{ required: true, message: '请选择客户', trigger: 'blur' }],
      },
      functionTypeList: [],
      companyList: [],
      chargemanList: [],
      componentList: [],
    }
  },
  computed: {
    ...mapState({
      userList: state => state.global.userList
    })
  },
  watch: {
    selectedNode() {
      this.$refs.form.resetFields()
      this.init()
    },
  },
  mounted() {
    this.functionTypeList = this.GetListEnum("FunctionType")
    this.getCompanyList()
    this.getComponentList()    
    this.init()
  },
  methods: {
    init() {
      this.form = {
        functionCode: '',
        functionName: '',
        functionType:this.selectedNode.node.groupName ? this.selectedNode.node.groupType + '' :this.selectedNode.node.functionType + '',
        companyIds: [],
        componentIds: [],
        chargeman: [],
        description: '',
      }
      if (this.type == 'updateFunction') {
        this.form.functionCode = this.selectedNode.node.functionCode
        this.form.functionName = this.selectedNode.node.functionName
        this.form.functionType = this.selectedNode.node.functionType + ''
        this.form.chargeman = this.selectedNode.node.chargeman ? this.selectedNode.node.chargeman.split(',') : []
        this.form.description = this.selectedNode.node.description
        this.getFunctionById(this.selectedNode)
      }   
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let params = _.cloneDeep(this.form)
          params.chargeman = params.chargeman.join(',')
          params.componentIds = params.componentIds.join(',')
          params.companyIds = params.functionType == '1' ? params.companyIds.join(',') : ''
          if (this.type == 'addFuncOrGroup') {
            params.parentId = this.selectedNode.node.id
            params.functionType = this.selectedNode.node.groupType
            this.$$api_functionGroup_addFunction({
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
          } else if (this.type == 'updateFunction') {
            params.id = this.selectedNode.node.id
            this.$$api_functionGroup_updateFunction({
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
    getFunctionById(selectedNode) {
      this.$$api_functionGroup_getFunctionById({
        restParam: {
          id: selectedNode.node.id
        },
        fn: data => {
          this.form.companyIds = data.companyIds ? data.companyIds.split(","): []
          this.form.componentIds = data.componentIds ? data.componentIds.split(",") : []
        },            
      })      
    },
    getCompanyList() {
      this.$$api_company_getCompanyList({
        fn: data =>{
          data.forEach(v => v.id+='')
          this.companyList = data
        }
      })     
    },
    getComponentList() {
      this.$$api_component_getComponentList({
        fn: data =>{
          data.forEach(v => v.id+='')
          this.componentList = data
        }
      })     
    },
    onCancel() {
      this.$emit('close')
      this.$refs.form.resetFields()
      this.form = {
        functionCode: '',
        functionName: '',
        functionType: '',
        companyIds: [],
        componentIds: [],
        chargeman: [],
        description: '',
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.P_addFunction {
  height: 100%;
  position: relative;
  .el-form {
    overflow: auto;
    height: calc(100% - 60px);
    .box {
      border: 1px solid #e9e8e8;
      padding: 20px;
      padding-bottom: 5px;
      position: relative;

    }
  }
  .footer {
    width: 100%;
    position: absolute;
    bottom: 20px;
  }
}
</style>