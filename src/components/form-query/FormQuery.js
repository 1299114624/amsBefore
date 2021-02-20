import Fields from '../fields'
import { handleResize } from 'mixins/resizeMixin.js'

export default {
  components: Fields,
  data() {
    return {
      setting: this.Setting,
      fields: this.Fields,
      sampleFields: this.SampleFields,
      isReset: this.isShowReset,
      temp_field_obj: {},
      submit_data: {},
      submit_info: {},
      sampleQueryRules: this.Rules,
      mainQueryRules: this.Rules,

      optionalQueryHeight: 0,
      isOptionalQueryShow: false,
      components: {
        input: 'AfInput',
        select: 'AfSelect',
        selectMultiple: 'AfSelectMultiple',
        checkbox: 'AfCheckbox',
        date: 'AfDate',
        daterange: 'AfDateRange',
      },
    }
  },
  computed: {
    computedKey() {
      return fieldKey => {
        if (this.TimeStampKey) {
          return Date.now()
        } else {
          return fieldKey
        }
      }
    },
    optionalQueryStyle() {
      return {
        'height': this.optionalQueryHeight,
        'borderTop': this.isOptionalQueryShow ? '1px solid #dfe6ec' : 'none'
      }
    }
  },
  methods: {
    /**
     * @description: 表单提交事件
     */  
    onSubmit() {
      let formatSubmitData = this.formatSubmitData()
      for (let item in formatSubmitData) {
        if (typeof(formatSubmitData[item]) === 'string') {
          // 参数 trim() 化
          formatSubmitData[item] = formatSubmitData[item].trim()
        }
      }
      var data = {
        data: formatSubmitData,
        info: this.submit_info
      }

      if (this.Rules) {
        this.$refs.sampleQuery.validate(valid => {
          if (valid) {
            if (!this.$refs.mainQuery) {
              this.$emit('onSubmit', data)
            } else {
              this.$refs.mainQuery.validate (isValid => {
                if(valid && isValid) {
                  this.$emit('onSubmit', data)
                }
              })
            }
          }
        })
      } else {
        this.$emit('onSubmit', data)
      }
    },
    // 格式化提交数据
    formatSubmitData() {
      let _obj = _.cloneDeep(this.submit_data)
      let fields = [].concat(this.fields, this.sampleFields)
      fields.forEach(field => {
        const _value = _obj[field.key]
        if (!_value || _value === "" || (_value instanceof Array && _value.length === 0)) {
          delete _obj[field.key]
          return
        }
        if (field.type === 'timerange') {
          // 无意义值处理
          if(_obj[field.key].length === 1 && _obj[field.key][0] === '') {
            delete _obj[field.key]
            return
          }
          _obj[field.key].forEach((item, index) => {
            if (item && item !== '') {
              _obj[field.key][index] = new Date(item).Format('yyyy-MM-dd hh:mm:ss')
            }
          })
        }
      })
      return _obj
    },
    /**
     * @description: 当只希望置空搜索内容，不想触发外部搜索条件时使用
     * @param {pure} 是否触发reset外部方法
     */  
    onReset(pure = false) {
      this.$refs.sampleQuery.resetFields()
      this.$refs.mainQuery.resetFields()
      if(!pure) {
        this.$emit('reset')
      }
      this.submit_data = _.cloneDeep(this.DefaultValue)
    },
    /**
     * @description: 点击更多查询，展示更多查询条件，重新计算content__table的高度，保证el-table可以固定表头
     */  
    moreQuery() {
      this.isOptionalQueryShow = !this.isOptionalQueryShow
      this.$emit('showAll', this.isOptionalQueryShow)
      handleResize(10)
    },
    // 更新formQuery字段
    // updateFieldList("ruleId", "list", [])
    updateFieldList(key, field, value) {
      let _temp = this.fields.concat(this.sampleFields)
      let i = _temp.length
      while (i--) {
        const item = _temp[i]
        if (item.key && item.key === key + '') item[field] = value
      }
    }
  },
  props: {
    SampleFields: {
      type: Array,
      required: false,
      default () {
        return []
      }
    },
    Fields: {
      type: Array,
      required: false,
      default () {
        return []
      }
    },
    // 默认以时间戳为key,轮询更新数据的页面不能以时间为key，不然会导致输入框、下拉框重新渲染，动态修改输入条件长度时用时间戳
    TimeStampKey: {
      type: Boolean,
      default: true
    },
    Rules: {
      type: Object,
      default () {
        return {}
      }      
    },
    DefaultValue: {
      type: Object,
      default () {
        return {}
      }      
    },
    Setting: {
      type: Object,
      default () {
        return {}
      }      
    }, 
    isShowReset: {
      type: Boolean,
      required: false,
      default () {
        return false
      }          
    } 
  },
  watch: {
    SampleFields: {
      deep: true,
      handler (v) {
        if (v) {
          this.sampleFields = v
        }
      }
    },    
    Fields: {
      deep: true,
      handler (v) {
        if (v) {
          this.fields = v
        }
      }
    },
    DefaultValue: {
      deep: true,
      immediate: true,
      handler (v) {
        if (v) {
          this.submit_data = v
        }
      }
    }, 
    Setting (v) {
      this.setting = v
    },
    isShowReset: {
      handler (v) {
        this.isReset = v
      }      
    },
    isOptionalQueryShow (val, oldVal) {
      if (oldVal) {
        this.optionalQueryHeight = '0px'
      } else {
        this.optionalQueryHeight = 'auto'
      }
    }  
  }
}