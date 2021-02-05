<template>
  <div class='C_FormQuery'>
    <section class="sample-query clear">
      <el-form
        ref="sampleQuery"
        :label-position="setting.labelPosition || 'right'"
        :inline="setting.inline || true"
        :model="submit_data"
        :rules="sampleQueryRules"
        @submit.native.prevent
      >
        <el-form-item class="prefix">
          <slot name="prefix"></slot>
        </el-form-item>
        <div :class="[field.type === 'br' ? '' : 'inlineBlock']" v-for="(field, index) in sampleFields">
          <!-- key值传时间戳，强制所有组件重新渲染，防止动态修改搜索条件时的dom复用导致下拉框字典不动态更新 -->
          <!-- 单纯只用field.key作为key值，动态使用 splice 更新 sampleFields 时，splice插入位置前的部分仍然会复用dom，不会更新下拉框的字典 -->
          <el-form-item v-if="field.type !== 'br'" v-bind="field.attrs || {}" :key="computedKey(field.type, field.key)" :label="field.label || ''" :prop="field.key || ''">
            <div class="form-item-container" :style="{width: field.width || 'auto'}">
              <component :is="components[field.type] || 'AfInput'" :Data="field" :SubmitData="submit_data" :SubmitInfo="submit_info" :TempFieldObj="temp_field_obj"></component>
            </div>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="pritextmary" @click="onReset" v-if="isReset">重置</el-button>
          <el-button type="text" @click="moreQuery" class="arrow" v-if="fields.length > 0">
            {{ isOptionalQueryShow ? '收起' : '更多' }}<i :class="['iconfont', 'icon-zhankaishouqi', isOptionalQueryShow ? 'open' : 'close']"></i>
          </el-button>
        </el-form-item>
        <el-form-item class="suffix right">
          <slot name="suffix"></slot>
        </el-form-item>
      </el-form>
    </section>
    <section class="main-query box-start" ref="optionalQueryContainer" :style="optionalQueryStyle">
      <el-form
        ref="mainQuery"
        class="form-inline"
        label-width="120px"
        :label-position="setting.labelPosition || 'right'"
        :inline="setting.inline || true"
        :model="submit_data"
        :rules="mainQueryRules"
        @submit.native.prevent
      >
        <div :class="[field.type === 'br' ? '' : 'inlineBlock']" v-for="(field, index) in fields">
          <el-form-item v-if="field.type !== 'br'" v-bind="field.attrs || {}" :key="computedKey(field.type, field.key)" :label="field.label || ''" :prop="field.key || ''">
            <div class="form-item-container" :style="{width: field.width || 'auto'}">
              <component :is="components[field.type] || 'AfInput'" :Data="field" :SubmitData="submit_data" :SubmitInfo="submit_info" :TempFieldObj="temp_field_obj"></component>
            </div>
          </el-form-item>
        </div>      
      </el-form>      
    </section>
  </div>
</template>

<script>
import FormQueryJs from './FormQuery.js'
export default FormQueryJs
</script>

<style lang='scss' scoped>
.C_FormQuery {
  background-color: #fff;
  overflow: hidden;
  .form-item-container {
    width: 160px;
  }
  .sample-query {
    padding-left: 10px;
  }
  .main-query {
    border-top: 1px solid #dfe6ec;
    padding-bottom: 0;
    overflow: hidden;
    transition: height .3s;
  }
  .arrow {
    i {
      display: inline-block;
      margin-left: 5px;
      vertical-align: top;
      font-size: 12px;
      transition: transform .1s;
    }
    .close {
      transform: rotate(90deg)
    }
    .open {
      transform: rotate(180deg);
    }
  }
  /deep/ .el-form-item__error {
    display: none;
    &.prefix, &.suffix {
      margin-right: 0;
    }
  }
  /deep/ .el-form-item__content {
    height: 40px;
  }
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>