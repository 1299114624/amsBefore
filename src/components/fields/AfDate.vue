<template>
  <el-date-picker
    type="date"
    v-model="submit_data[data.key]"
    v-bind="attrs"
    :placeholder="data.desc"
    @change="onChange"
    :value-format="attrs['value-format'] || 'yyyy-MM-dd'">
  </el-date-picker>
</template>

<script>
import Common from './js/Common'
var Js = Common('af-date')
Js.mixins = [{
  methods: {
    onChange(v) {
      this.events.change && this.events.change(v)
    },
  }
}]
export default Js
</script>
