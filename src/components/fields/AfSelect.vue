<template>
  <el-select
    v-model="value"
    v-bind="attrs"
    :placeholder="data.desc"
    @change="onChange"
    @visible-change="onVisibleChange"
    @remove-tag="onRemoveTag"
    @clear="onClear"
  >
    <el-option
      v-for="(item,index) in list"
      :key="index"
      v-bind="option_attrs"
      :value="item[value_attr]"
      :label="item[label_attr]"
    ></el-option>
  </el-select>
</template>

<script>
import Common from './js/Common'
var Js = Common('af-select')
Js.mixins = [{
  data() {
    return {
      list: [],
      value: null
    }
  },
  computed: {  
    option_attrs() {
      return this.Data.option_attrs || {}
    },    
  },
  created() {
    if(this.data.enumcode) {
      this.$store.dispatch('getEnum', this.data.enumcode).then(list => {
        this.list = list
      })
    } else {
      this.list = this.data.list
    }
    this.updateValue()
  },
  watch: {
    value(val) {
      this.submit_data[this.data.key] = val
    },
    submit_data: {
      deep: true,
      handler() {
        this.updateValue()
      }
    },
    data: {
      deep: true,
      handler(val) {
        this.list = val.list
        this.updateValue()
      }
    }
  },
  methods: {
    onChange(v) {
      this.submit_data[this.data.key] = v
      if(v) {
        if(Array.isArray(v)) {
          this.submit_info[this.data.key] = []
          v.forEach(item => {
            this.submit_info[this.data.key].push(this.temp_field_obj[this.data.key][item])
          })
        } else {
          this.submit_info[this.data.key] = ''
          this.submit_info[this.data.key] = this.temp_field_obj[this.data.key][v]
        }
      }
      this.events.change && this.events.change({value: v, info: this.submit_info[this.data.key]})
    },
    onVisibleChange() {
      this.events['visible-change'] && this.events['visible-change']()
    },
    onRemoveTag() {
      this.events['remove-tag'] && this.events['remove-tag']()
    },
    onClear() {
      this.events.clear && this.events.clear()
    },
    updateValue() {
      this.value = this.submit_data[this.data.key] ? this.submit_data[this.data.key] + '' : this.submit_data[this.data.key]
    }
  }
}]
export default Js
</script>
