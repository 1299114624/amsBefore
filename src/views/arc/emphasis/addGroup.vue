<template>
  <div class='P_addAccountUser'>
    <el-dialog 
      :title="title"
      :visible.sync="show"
      :close-on-click-modal="false"
      width="580px"
      @close="onCancel">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="适配规则：" class="required">
          <el-tabs v-model="tabsActive">
            <el-tab-pane :label="`${ruleType.name}（${tableDataCount[ruleType.value]}）`" :name="ruleType.value" v-for="ruleType in ruleTypeEnum" :key="ruleType.value">
              <check-rule-table :data="checkRuleTableData[ruleType.value]" :type="ruleType.value" :loading="loadingRule" @changeRuleTable="changeRuleTable" :key="ruleType.value"/>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
      </el-form>  
      <p slot="footer">
        <el-button size="small" type="primary" :loading="loading" @click="onSubmit">确 定</el-button>  
        <el-button size="small" @click="onCancel">取 消</el-button>  
      </p>       
    </el-dialog>
  </div>
</template>

<script>
import checkRuleTable from './checkRuleTable.vue'
export default {
  components: { checkRuleTable },
  props: ['isVisible', 'type', 'detail'],
  data () {
    return {
      show: false,
      title: '新增组件',
      loading: false,
      addTable: [1],
      reasonCodesList: [],
      addUserList: [],
      form: {
      },
      rules: {
      },
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