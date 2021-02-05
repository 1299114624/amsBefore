<template>
  <el-input
    type='input'  
    v-model="submit_data[data.key]"
    v-bind="attrs"
    :placeholder="data.desc"
    @click="onClick"
    @blur="onBlur"
    @focus="onFocus"
    @change="onChange"
  ></el-input>
</template>

<script>
import Common from './js/Common'
import InputTextarea from './js/InputTextarea'
var Js = Common('af-input')
Js.mixins = [InputTextarea]
export default Js
</script>
