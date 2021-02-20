<template>
  <el-select
    class="selectMultiple"
    v-model="submit_data[data.key]"
    v-bind="attrs"
    :placeholder="data.desc"
    @change="onChange"
    size="mini"
    multiple
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
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.list = val.list
      }
    }
  },
  methods: {
    onChange(v) {
      this.submit_data[this.data.key] = v
      this.events.change && this.events.change({value: v, info: this.submit_info[this.data.key]})
    },
  }
}]
export default Js
</script>

<style lang="scss" scoped>
.selectMultiple {
  /deep/.el-select__input.is-mini {
    font-size: 12px;
  }
}
</style>