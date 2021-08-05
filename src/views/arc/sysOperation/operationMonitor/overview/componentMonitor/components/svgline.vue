<template>
  <g :style="`stroke:${item.color || '#2d83ec'};stroke-width: ${item.width || '3px'}`">
    <!-- 起点箭头 -->
    <polygon :points="startPoint" v-if="item.showStart"></polygon>
    <!-- 实线 -->
    <path :id="`path${index}`" v-if="!item.dash" :d="path" fill='none'></path>
    <!-- 虚线 -->
    <path :id="`path${index}`" stroke-dasharray="5, 3" v-else :d="path" fill='none'></path>
    <!-- 终点点箭头 -->
    <polygon :points="endPoint" v-if="!item.hiddenEnd"></polygon>
  </g>
</template>

<script>
export default {
  props: ['item', 'scaleX', 'scaleY', 'index'],
  data () {
    return {
      XWidth: 1224,
      YHeight: 524,
      dir: 'horizontal',
      isSql: false,
      text: '',
      isDouble: false,
      relPos: 'left'
    }
  },
  computed: {
    path() {
      let x = (this.item.x1 + this.item.x2) * this.scaleX / 2
      let y = (this.item.y1 + this.item.y2) * this.scaleY / 2
      let x1 = this.item.x1 * this.scaleX
      let x2 = this.item.x2 * this.scaleX
      let y1 = this.item.y1 * this.scaleY
      let y2 = this.item.y2 * this.scaleY
      let ry = this.item.ry * this.scaleY
      let r = 12 // 转弯弧度的半径
      let ro = 8 // 重叠弧度的半径

      if (this.item.dir == 'h') {
        if (y1 < y2) {
          return `M${x1} ${y1} L${x - r} ${y1} Q${x} ${y1} ${x} ${y1 + r} L${x} ${y2 - r} Q${x} ${y2} ${x + r} ${y2} L${x2} ${y2}`
        } else if (y1 > y2) {
          return `M${x1} ${y1} L${x - r} ${y1} Q${x} ${y1} ${x} ${y1 - r} L${x} ${y2 + r} Q${x} ${y2} ${x + r} ${y2} L${x2} ${y2}`
        } else {
          return `M${x1} ${y1} L${x2} ${y2}`
        }
      } else if (this.item.dir == 'h-v') {  // 先横后竖：左上-右下 / 左上-左下
        if (x1 > x2) {
          return `M${x1} ${y1} L${x2 + r} ${y1} A${r} ${r} ${0} ${0} ${0} ${x2} ${y1+r} L${x2} ${y2}`
        } else if (x1 < x2) {
          return `M${x1} ${y1} L${x2 - r} ${y1} A${r} ${r} ${0} ${0} ${1} ${x2} ${y1+r} L${x2} ${y2}`
        } else {
          return `M${x1} ${y1} L${x2} ${y2}`
        }
      } else if (this.item.dir == 'v-r') { // 垂直重叠
        return `M${x1} ${y1} L${x1} ${ry} A${ro} ${ro} ${0} ${0} ${1} ${x1} ${ry + ro * 2} L${x1} ${y2}`
      } else if (this.item.dir == 'v-r') { // 先竖后横
        return `M${x1} ${y1} L${x1} ${y2 - r} Q${x1} ${y2} ${x1 + r} ${y2} L${x2} ${y2}`
      } else {
        // 此处主要对齐数据库图标
        if (Math.abs(x1 - x2) < 2 * r) {
          x2 = x1
        }
        if (x1 > x2) {
          return `M${x1} ${y1} L${x1} ${y - r} Q${x1} ${y} ${x1 - r} ${y} L${x2 + r} ${y} Q${x2} ${y} ${x2} ${y + r} L${x2} ${y2}`
        } else if (x1 < x2) {
          return `M${x1} ${y1} L${x1} ${y - r} Q${x1} ${y} ${x1 + r} ${y} L${x2 - r} ${y} Q${x2} ${y} ${x2} ${y + r} L${x2} ${y2}`
        } else {
          return `M${x1} ${y1} L${x2} ${y2}`
        }
      }
    },
    startPoint() {
      let distance = 4
      if (this.item.dir == 'h') {
        return `${this.item.x1 * this.scaleX + 1} ${this.item.y1 * this.scaleY} ${this.item.x1 * this.scaleX + distance} ${this.item.y1 * this.scaleY - distance} ${this.item.x1 * this.scaleX + distance} ${this.item.y1 * this.scaleY + distance}`
      } else {
        if (Math.abs(this.item.x1 - this.item.x2) < 24) {
          // 此处 24 是path中半径的2倍
          this.item.x2 = this.item.x1
        }
        return `${this.item.x1 * this.scaleX} ${this.item.y1 * this.scaleY + 1} ${this.item.x1 * this.scaleX + distance} ${this.item.y1 * this.scaleY + distance} ${this.item.x1 * this.scaleX - distance} ${this.item.y1 * this.scaleY + distance}`
      }
    },
    endPoint() {
      let distance = 4
      if (this.item.dir == 'h') {
        return `${this.item.x2 * this.scaleX - 1} ${this.item.y2 * this.scaleY} ${this.item.x2 * this.scaleX - distance} ${this.item.y2 * this.scaleY - distance} ${this.item.x2 * this.scaleX - distance} ${this.item.y2 * this.scaleY + distance}`
      } else if (this.item.dir == 'v-h') {
        return `${this.item.x2 * this.scaleX - 1} ${this.item.y2 * this.scaleY} ${this.item.x2 * this.scaleX - distance} ${this.item.y2 * this.scaleY - distance} ${this.item.x2 * this.scaleX - distance} ${this.item.y2 * this.scaleY + distance}`
      } else {
        return `${this.item.x2 * this.scaleX} ${this.item.y2 * this.scaleY - 1} ${this.item.x2 * this.scaleX - distance} ${this.item.y2 * this.scaleY - distance} ${this.item.x2 * this.scaleX + distance} ${this.item.y2 * this.scaleY - distance}`
      }
    },
  }
}
</script>

<style lang='scss' scoped>
div {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>