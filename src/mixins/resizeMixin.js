/**
 * 根据 window.resize 事件计算 content__table 的高度
 * 主体结构由 P_content, content__search, content__table, content__page 4个部分组成
 * 它们的布局样式位于 assets/css/_layout.scss
 * 为了计算准确，需要保证 P_content 的高度准确，即它已经 "正确" 的撑满它的父元素
 */

// 作为方法
function handleResize(delay) {
  delay = delay || 10
  setTimeout(() => {
    let $content = document.querySelectorAll('.G_main .P_content')
    let $contentArr = Array.from($content)
    $contentArr.forEach(content => {
      let $content__search = content.querySelector('.content__search')
      let $content__table = content.querySelector('.content__table')
      let $content__page = content.querySelector('.content__page')
      // !!做类型判断，表示 a!=null&&typeof(a)!=undefined&&a!='' 才会执行
      let searchHeight = !!$content__search ? $content__search.offsetHeight : 0
      let pageHeight = !!$content__page ? $content__page.offsetHeight : 0
      let tableHeight = content.offsetHeight - searchHeight - pageHeight
      $content__table.style.height = tableHeight + 'px'
    })
  }, delay)
}
export { handleResize }

// 作为 mixin
export default {
  data() {
    return {
      resizeId: null,
      loadingData: true
    }
  },
  computed: {
    emptyText() {
      return this.loadingData ? '数据加载中...' : '暂无数据'
    }
  },
  mounted() {
    this.handleResize()
    window.onresize = this.handleResize
  },
  destroyed() {
    window.onresize = null
  },
  methods: {
    /**
     * @description: window.onresize 事件处理函数
     * @param {Number} delay  setTimeout 延迟时间
     */
    handleResize(delay) {
      delay = delay || 200
      setTimeout(() => {
        let $content = document.querySelectorAll('.G_main .P_content')
        let $contentArr = Array.from($content)
        $contentArr.forEach(content => {
          let $content__search = content.querySelector('.content__search')
          let $content__table = content.querySelector('.content__table')
          let $content__page = content.querySelector('.content__page')
          // !!做类型判断，表示 a!=null&&typeof(a)!=undefined&&a!='' 才会执行
          let searchHeight = !!$content__search ? $content__search.offsetHeight : 0
          let pageHeight = !!$content__page ? $content__page.offsetHeight : 0
          let tableHeight = content.offsetHeight - searchHeight - pageHeight
          $content__table.style.height = tableHeight + 'px'
        })
      }, delay)
    }    
  }
}