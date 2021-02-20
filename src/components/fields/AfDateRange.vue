<template>
  <el-date-picker
    type="daterange"
    v-model="submit_data[data.key]"
    v-bind="attrs"
    :placeholder="data.desc"
    @change="onChange"
    :range-separator="attrs['range-separator'] || '至'"
    :start-placeholder="attrs['start-placeholder'] || '开始日期'"
    :end-placeholder="attrs['end-placeholder'] || '结束日期'"
    :value-format="attrs['value-format'] || 'yyyy-MM-dd'"
    :unlink-panels="attrs['unlink-panels'] || false"
  >
  </el-date-picker>
</template>

<script>
import Common from './js/Common'
var Js = Common('af-date-range')
Js.mixins = [{
  computed: {
    range_separator() {
      return this.Data.date_range_attrs['range-separator'] || ' - '
    }
  },
  created() {
    this.setValueStringToArray()
  },
  methods: {
    onChange(v) {
      this.events.change && this.events.change({value: v, info: this.submit_info[this.data.key]})
    },

    /**
     * 如果传的默认值为字符串，自动转为数组
     */
    setValueStringToArray() {
      // 传了默认值且为字符串再处理
      if (typeof this.submit_data[this.data.key] === 'string' && this.submit_data[this.data.key]) {
        // 默认值必须包含分隔符
        if (this.submit_data[this.data.key].indexOf(this.range_separator) !== -1) {
          this.submit_data[this.data.key] = this.submit_data[this.data.key].split(this.range_separator)
        } else {
          console.error('日期范围默认值为数组，如果设置成了字符串，范围分隔符必须和设置的一样，默认分隔符为 " - "!')
        }
      }
    }
  }
}]
export default Js
</script>
