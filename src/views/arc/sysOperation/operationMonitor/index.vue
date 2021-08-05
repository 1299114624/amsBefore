<template>
  <div class='P_cpMonitor'>
    <div class="svgPos">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        :viewBox="`0 0 ${viewBoxW} ${viewBoxH}`"
        preserserveAspectRatio="xMinYmin slice"
        class="svgline">
        <svg-line
          v-for="(item, index) in linesList"
          :key="`line_${index}`"
          :index="index"
          :item="item"
          :scaleX="scaleX"
          :scaleY="scaleY"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import svgLine from './overview/componentMonitor/components/svgline.vue'
import * as config from './overview/config/index'
export default {
  mixins: [],
  components: {
    svgLine
  },
  props: [],
  data () {
    return {
      viewBoxW: 0,
      viewBoxH: 0,
      scaleX: 1,
      scaleY: 1,
      linesList: [],
      screenWidth: document.body.clientWidth || document.documentElement.clientWidth,
      screenHeight: document.body.clientHeight || document.documentElement.clientHeight,
      UIWidth: 1224,
      UIHeight: 524,
      isFullPage: false
    }
  },
  watch: {
    screenWidth(val) {
      if (val <= 1080) val = 1080
      this.viewBoxW = val - 56
      this.scaleX = (this.viewBoxW / this.UIWidth).toFixed(4)
    },
    screenHeight(val) {
      let distance = this.isFullPage ? 64 : 144 //50 + 30 + 48 + 16
      this.viewBoxH = val - distance
      this.scaleY = (this.viewBoxH / this.UIHeight).toFixed(4)
    },
  },
  mounted () {
    let self = this
    if (this.screenWidth < 1080) {
      this.screenWidth = 1080
    }
      this.viewBoxW = this.screenWidth - 56
      this.scaleX = (this.viewBoxW / this.UIWidth).toFixed(4)
      this.viewBoxH = this.screenHeight - 144
      this.scaleY = (this.viewBoxH / this.UIHeight).toFixed(4)
    window.onresize = () => {
      return (() => {
        self.screenWidth = document.body.clientWidth || document.documentElement.clientWidth
        self.screenHeight = document.body.clientHeight || document.documentElement.clientHeight
      })()
    }
    this.getCpsList()
  },
  methods: {
    getCpsList() {
      this.getCpsParams()
    },
    getCpsParams() {
      this.linesList = config.lines
    }
  }
}
</script>

<style lang='scss' scoped>
.P_cpMonitor {
  height: 100%;
  .svgPos {
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    .svgline {
      fill: white;
      fill-opacity: 0.3;
    }
  }
}
</style>