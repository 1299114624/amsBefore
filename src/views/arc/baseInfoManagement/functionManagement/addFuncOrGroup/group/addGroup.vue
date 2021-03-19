<template>
  <div class='P_addGroup'>
    <el-form :model="form" :rules="rules" ref="form" label-width="110px">
      <div class="box">
        <el-form-item prop="groupName" label = "分组名称：">
          <el-input v-model="form.groupName" placeholder="请输入"></el-input>  
        </el-form-item>  
        <el-form-item prop="groupDesc" label = "分组描述：">
          <el-input v-model="form.groupDesc" placeholder="请输入" type="textarea" :rows="5"></el-input>  
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
export default {
  props: ['radio', 'type', 'selectedNode'],
  data () {
    return {
      loading: false,
      form: {
        groupName: '',
        groupDesc: '',
      },
      rules: {
        groupName: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
      },
    }
  },
  watch: {
    selectedNode() {
      this.form = {
        groupName: '',
        groupDesc: '',
      }
    },    
    radio: {
      immediate: true,
      handler (v) {
        if (this.type == 'updateGroup') {
          this.form.groupName = this.selectedNode.node.groupName
          this.form.groupDesc = this.selectedNode.node.groupDesc
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
          if (this.type == 'addFuncOrGroup') {
            params.parentCode = this.selectedNode.node.groupCode
            params.groupType = this.selectedNode.node.groupType
            this.$$api_functionGroup_addFunctionGroup({
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
          } else if (this.type == 'updateGroup') {
            params.id = this.selectedNode.node.id
            this.$$api_functionGroup_updateFunctionGroup({
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
      this.$emit('close')
      this.$refs.form.resetFields()
      this.form = {
        groupName: '',
        groupDesc: '',
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.P_addGroup {
  height: 100%;
  position: relative;
  overflow: auto;
  .box {
    border: 1px solid #e9e8e8;
    padding: 20px;
    padding-bottom: 5px;
    position: relative;
    .el-form {
      overflow: hidden;
    }
  }
  .footer {
    width: 100%;
    position: absolute;
    bottom: 20px;
  }
}
</style>