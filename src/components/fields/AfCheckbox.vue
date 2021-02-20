<template>
<div class="C_Checkbox">
  <el-checkbox class="check-all" v-if="data.checkAll" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAll">全部</el-checkbox>
  <!-- 普通CheckBox -->
  <el-checkbox-group @change="change" v-bind="attrs" v-model="submit_data[data.key]">
    <el-checkbox v-for="(checkbox,index) in list" :key="index" :label="checkbox.value" v-bind="checkbox_attrs(checkbox)">
      {{checkbox.name || checkbox.value}}
    </el-checkbox>
  </el-checkbox-group>
</div>
</template>

<script>
import Common from './js/Common'
var Js = Common('af-checkbox')
Js.mixins = [{
  data() {
    return {
      checkAll: true,
      isIndeterminate: true,
      list: [],
    }
  },
  computed: { 
    checkValues() {
      let vals = []
      this.list.forEach(item => {
        vals.push(item.value)
      })
      return vals
    }    
  },
  created() {
    if(!this.submit_data[this.data.key]) {
      this.$set(this.submit_data, this.data.key, [])
    }
    if(this.data.enumcode) {
      this.$store.dispatch('getEnum', this.data.enumcode).then(list => {
        this.list = list
      })
    } else {
      this.list = this.data.list
    }
  },
  methods: {
    change(val) {
      if(Array.isArray(val)) {
        this.submit_info[this.data.key] = []
        val.forEach(item => {
          this.submit_info[this.data.key].push(this.temp_field_obj[this.data.key][item])
        })
      }
      this.events.change && this.events.change({value: val, info: this.submit_info[this.data.key]})
    },
    // 设置ElementUI组件的属性
    checkbox_attrs(checkbox) {
      return Object.assign(checkbox.attr || {}, this.Data.attrs || {})
    },
    handleCheckAll(e,event) {
      this.submit_data[this.data.key] = event.target.checked ? this.checkValues : []
      this.change(this.submit_data[this.data.key])
      this.isIndeterminate = false
    }
  }
}]
export default Js
</script>

<style lang="scss" scoped>
.C_Checkbox {
  display: flex;
  .check-all {
    margin-right: 10px;
  }
}
</style>