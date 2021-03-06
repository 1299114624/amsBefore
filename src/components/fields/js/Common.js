export default function(name) {
  return {
    name: name,
    data() {
      return {
        test:''
      }
    },
    computed: {
      data() {
        return this.Data
      },
      events() {
        return this.Data.events || {}
      },
      submit_data() {
        return this.SubmitData
      },
      submit_info() {
        return this.SubmitInfo
      },
      temp_field_obj() {
        return this.TempFieldObj
      },
      custom_attrs() {
        return this.Data.custom_attrs || {}
      },
      // 自定义label字段映射
      label_attr() {
        return this.data.enumcode ? 'name' : this.custom_attrs.label || 'name'
      },
      // 自定义value字段映射
      value_attr() {
        return this.custom_attrs.value || 'value'
      },
      attrs() {
        return this.Data.attrs || {}
      },        
    },
    props: {
      Data: {
        type: Object,
        default() {
          return {}
        }
      },
      SubmitData: {
        type: Object,
        default() {
          return {}
        }
      },
      SubmitInfo: {
        type: Object,
        default() {
          return {}
        }
      },
      TempFieldObj: {
        type: Object,
        default() {
          return {}
        }
      },
    },
    methods: {
      /**
       * 处理表单控件值复数类型，比如，获取的值和显示的文本不同时，除了返回需要提交表单的value值，还需要返回显示的文本，以防不时之需
       */
      setArrayValue() {
        // 把存储value和text的数组转成对象格式，有利于提高根据值取文本的效率
        if(!this.temp_field_obj[this.data.key]) {
          this.temp_field_obj[this.data.key] = {}
        }


      },
      /**
       * 当submit_data没有传默认值,或者连default_value都不存在时（添加的时候确实是不需要传default_value，如果不这样操作一下，绑定就会失败）
       * 此时，组件中定义的default_value只是一个空对象，这时，v-model是无法绑定的，所以这个函数用来设置默认字段。
       */
      setDefaultFieldByNoDefaultValue() {
        if (this.submit_data[this.data.key] === undefined) {
          this.$set(this.submit_data, this.data.key, '')
        }
      }
    },
    created() {
      this.setDefaultFieldByNoDefaultValue()
      this.setArrayValue()
    }
  }
}