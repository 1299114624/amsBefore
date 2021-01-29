import { gbs } from 'config'
export default {
  data() {
    return {
      pageSize: gbs.pageSize,     // 20 每页的记录数
      pageSizes: gbs.pageSizes,   // [10, 20, 30, 40, 50] 每页显示的个数选择器
      pageNumber: 1,              // 当前第几页
      totalCount: 0,              // 总条数
      paginationLayout: 'total, sizes, prev, pager, next, jumper',
      sortKey: '',                // 排序关键字
      sortType: ''                // 排序类型
    }
  },
  methods: {
    // 每条页数改变
    handleSizeChange (val) {
      this.pageSize = val
      this.query()
    },
    // 当前页改变
    handleCurrentChange (val) {
      this.pageNumber = val
      this.query()
    }
  }
}