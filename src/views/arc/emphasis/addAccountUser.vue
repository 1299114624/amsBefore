<template>
  <div class='P_addAccountUser'>
    <el-dialog 
      :title="title"
      :visible.sync="show"
      :close-on-click-modal="false"
      width="580px"
      @close="onCancel">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-table class="table__add" :data="addTable" border>
          <el-table-column label="客户号" header-align="center" align="center" width="100px">
            <template>
              <el-form-item prop="customerId">
                <el-input v-model="form.customerId"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="重点监控原因" header-align="center" align="center" width="100px">
            <template>
              <el-form-item prop="reasonCodes">
                <el-select multiple v-model="form.reasonCodes" collapse-tags>
                  <el-option v-for="(item,index) in reasonCodesList" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template>
              <el-button type="text" @click.stop="addUser">
                <i class="el-icon-plus" style="color:#67c23a;font-weight:600"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="addUserList" :show-header="false" border>
          <el-table-column label="客户号"  align="center" width="100px" prop="customerId"></el-table-column>
          <el-table-column label="重点监控原因"  align="center" width="100px" prop="reasonCodes"></el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click.stop="deleteUser(scope.$index)">
                <i class="el-icon-minus" style="color:#f56c6c;font-weight:600"></i>
              </el-button>
            </template>
          </el-table-column>          
        </el-table>
      </el-form>  
      <p slot="footer">
        <el-button size="small" type="primary" :loading="loading" @click="onSubmit">确 定</el-button>  
        <el-button size="small" @click="onCancel">取 消</el-button>  
      </p>       
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
      addTable: [1],
      reasonCodesList: [],
      addUserList: [],
      form: {
        customerId: '',
        reasonCodes: []
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
      addDisabled: true,
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
        this.title = this.type == 'add' ? '新增组件' : '修改组件'
        if (this.type == 'update') {
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
          if (this.type == 'add') {
            this.$$api_component_addComponent({
              data: params,
              fn: data => {
                this.$emit('refresh')
                this.$$SuccessMessage('新增成功！')
                this.onCancel()
                this.loading = false
              },
              errFn(err) {
                this.loading = false
                this.$$ErrorMessage(err.msg)
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
              },
              errFn(err) {
                this.loading = false
                this.$$ErrorMessage(err.msg)
              }              
            })
          }
        }
      })
    },  
    addUser() {
      let obj = _.cloneDeep(this.form)
      this.addUserList.push(obj)
      this.addDisabled = true
      this.$refs.form.resetFields()
      this.form = {
        customerId: '',
        reasonCodes: []
      }      
    },
    deleteUser(listIndex) {
      this.addUserList = this.addUserList.filter((item,index) => index !== listIndex)
    },
    onCancel() {
      this.$emit('update:isVisible', false)
      this.$refs.form.resetFields()
      this.form = {
        customerId: '',
        reasonCodes: []
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.P_addAccountUser {
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