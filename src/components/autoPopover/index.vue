<template>
  <div class='auto-popover'>
    <el-popover
      v-bind="attrs"
      :trigger="trigger"
      :width="width"
      :placement="placement"
      :disabled="!showPopover"
    >
      <!-- 使用slot定义气泡出现时浮现内容 -->
      <template v-if="useSlot">
        <!-- 只使用slot中的content时，气泡浮现内容默认和content一致 -->
        <slot v-if="useSlotBubble" name="bubble"></slot>
        <p v-else class="my-popover">
          <slot name="content"></slot>
        </p>
      </template>
      <!-- 默认不使用slot时，气泡出现时浮现内容 -->
      <p v-else class="my-popover">
        <span v-if="vhtml" v-html="popoverValue"></span>
        <span v-else>{{ popoverValue }}</span>
      </p>
      <!-- 想要出现气泡的文本内容（不是气泡浮现内容） -->
      <div slot="reference">
        <div ref="container" 
          class="container"
          :class="{
            'plain-ellipsis': rows == 1,
            'auto-popover-ellipsis': rows != 1,
            'auto-popover_rows-2': rows == 2,
            'auto-popover_rows-3': rows == 3,
          }"  
        >
          <slot v-if="useSlotContent" name="content"></slot>
          <span v-else :class="{ 'pointer': showPopover }">
            <span v-if="vhtml" v-html="popoverValue"></span>
            <span v-else>{{ popoverValue }}</span>
          </span>
        </div>
        <!-- 计算宽度用，多行省略号时更有用 -->
        <div v-if="useSlot" class="cal-content" ref="content">
          <slot name="content"></slot>
        </div>
        <div v-else class="cal-content" ref="content">
          <span>{{ popoverValue }}</span>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
// content插槽必须使用inline类型标签，不受宽度限制，被内容撑开，便于计算时获取内容实际宽度
export default {
  props: {
    //必传，即使使用slot。需监听数据变化，根据变化来重新计算宽度，比如表格翻页，如不重新计算，后一页相同位置的计算宽度不会更新
    popoverValue: {
      required: true,
    },
    //行数
    rows: {
      type: [Number, String],
      default: '1'
    },
    //强制展示气泡
    forceShowPopover: {
      type: Boolean,
      default: false
    },
    //是否使用v-html
    vhtml: {
      type: Boolean,
      default: false
    },
    //v-bind参数
    attrs: {
      type: Object,
      default() {
        return {}
      }
    },
    trigger: {
      type: String,
      default: "hover"
    },
    width: {
      type: String,
      default: "150px"
    },
    placement: {
      type: String,
      default: "bottom"
    },
  },
  data () {
    return {
      showPopover: false
    }
  },
  computed: {
    useSlot() {
      return Object.keys(this.$slots).length
    },
    useSlotBubble() {
      return Object.keys(this.$slots).indexOf("bubble") > -1
    },
    useSlotContent() {
      return Object.keys(this.$slots).indexOf("content") > -1
    },
  },
  watch: {
    popoverValue: {
      immediate: true,
      deep: true,
      async handler(value) {
        if(value == null) {
          value = ''
        } else if (Array.isArray(value)) {
          value = value.join(',')
        } else {
          value = value
        }
        await this.$nextTick()
        this.calculateWidth()
      }
    }
  },
  methods: {
    calculateWidth() {
      let container = this.$refs.container;
      let content = this.$refs.content
      // +value 相当于 Number(value)
      let rows = +this.rows
      let containerWidth = container.offsetWidth
      let contentWidth = content.offsetWidth
      if (this.forceShowPopover) {
        this.showPopover = true
      } else {
        if (containerWidth * rows < contentWidth) {
          this.showPopover = true
        } else {
          this.showPopover = false
        }
      }
    },
    /**
     * @description: 用于父组件手动调用
     * @param {*}
     */  
    triggerCalculate() {
      this.calculateWidth()
    }
  }
}
</script>

<style lang='scss' scoped>
.auto-popover {
  overflow: hidden;
  .my-popover {
    display: inline-block;
    max-width: 300px;
    word-break: break-all;
  }
  .cal-content {
    white-space: nowrap;
    display: inline-block;
    position: absolute;
    visibility: hidden;
    left: -100000px;
  }
  .auto-popover-ellipsis {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .auto-popover_rows-2 {
    -webkit-line-clamp: 2;
  }
  .auto-popover_rows-3 {
    -webkit-line-clamp: 3;
  }
}
</style>