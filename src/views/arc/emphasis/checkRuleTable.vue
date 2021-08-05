<template>
  <div class='checkRuleTable'>
    <el-checkbox @change="chooseAllRules" v-model="isAllRules" :indeterminate="isIndeterminate">全部规则</el-checkbox>
    <el-table
      ref="tableRef"
      :data="checkRuleTableData"
      :span-method="objectSpanMethod"
      max-height="260"
      v-loading="loading"
      border="">
      <el-table-column prop="parentName" label="规则类别分级" min-width="200" header-align="center" align="center">
        <template slot-scope="scope">
          <el-checkbox @change="changeLevel1(scope.row.parentId, scope.row.parentIsCheck)" v-model="scope.row.parentIsCheck">
            {{scope.row.parentName}}  
          </el-checkbox>  
        </template>  
      </el-table-column>  
      <el-table-column prop="name" label="规则类别大类" min-width="220" header-align="center" align="left">
        <template slot-scope="scope">
          <el-checkbox @change="changeLevel2(scope.row.id, scope.row.isCheck, scope.row.parentId)" v-model="scope.row.isCheck">
            {{scope.row.name}}  
          </el-checkbox>  
        </template>  
      </el-table-column>  
      <el-table-column prop="children" label="规则名称" min-width="220" header-align="center" align="left">
        <template slot-scope="scope">
          <span v-for="(child, index) in scope.row.children" :key="index" class="childNode">
            <el-checkbox @change="changeLevel3(child.id, child.isCheck, scope.row.id, scope.row.parentId)" v-model="child.isCheck">
              {{child.name}}  
            </el-checkbox>  
          </span>
        </template>  
      </el-table-column>  
    </el-table>
  </div>
</template>

<script>
export default {
  mixins: [],
  props: {
    data: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    type: {
      type: String,
      required: true,
      default () {
        return '0'
      }      
    },
    loading: {
      type: Boolean,
      required: true,
      default () {
        return false
      }      
    }
  },
  data () {
    return {
      checkRuleTableData: [],
      isAllRules: false,
      isIndeterminate: false,
    }
  },
  watch: {
    data(val) {
      this.checkRuleTableData = JSON.parse(JSON.stringify(val))
      this.styleRuleTable()
    }
  },
  computed: {
    // 获取table合并数据
    spanArr() {
      let arr = []
      let pos = 0
      for (let i = 0; i <= this.checkRuleTableData.length - 1; i++) {
        if (i === 0) {
          arr.push(1)
          pos = 0
        } else {
          if (
            this.checkRuleTableData[i].parentName ===
            this.checkRuleTableData[i-1].parentName
          ) {
            arr[pos] += 1;
            arr.push(0)
          } else {
            arr.push(1)
            pos = i
          }
        }
      }
      return arr
    }
  },
  mounted () {},
  methods: {
    // 合并一级菜单table行
    objectSpanMethod({ row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        const row = this.spanArr[rowIndex]
        const col = row > 0 ? 1 : 0
        return {
          rowspan: row,
          colspan: col
        }
      }
    },
    // 选择全部规则
    chooseAllRules(val) {
      for (let i = 0; i < this.checkRuleTableData.length; i++) {
        this.checkRuleTableData[i].parentIsCheck = val
        this.checkRuleTableData[i].isCheck = val
        let childrenArr = this.checkRuleTableData[i].children || []
        for (let j = 0; j < childrenArr.length; j++) {
          childrenArr[j].isCheck = val
        }
      }
      this.styleRuleTable()
    },
    // 规则分类
    changeLevel1(id, isCheck) {
      for (let i = 0; i < this.checkRuleTableData.length; i++) {
        if (this.checkRuleTableData[i].parentId === id) {
          this.checkRuleTableData[i].parentIsCheck = isCheck
          this.checkRuleTableData[i].isCheck = isCheck
          let childrenArr = this.checkRuleTableData[i].children || []
          for (let j = 0; j < childrenArr.length; j++) {
            childrenArr[j].isCheck = val
          }                    
        }
      }
      this.styleRuleTable()
    },
    // 规则大类
    changeLevel2(id, isCheck, parentId) {
      let firstParentIndex = {}
      // 上级控制下级是否全部check
      for (let i = 0; i < this.checkRuleTableData.length; i++) {
        if (this.checkRuleTableData[i].id === id) {
          this.checkRuleTableData[i].isCheck = isCheck
          let childrenArr = this.checkRuleTableData[i].children || []
          for (let j = 0; j < childrenArr.length; j++) {
            childrenArr[j].isCheck = val
          }          
        }
        if (typeof(firstParentIndex[parentId] == 'undefined' && this.checkRuleTableData[i].parentId == parentId)) {
          firstParentIndex[parentId] = i
        }
      }   
      for (let i = 0; i < this.checkRuleTableData.length; i++) {
        if (this.checkRuleTableData[i].parentId === parentId) {
          this.checkRuleTableData[i].parentIsCheck = true
        }
      }    
      // 下级控制上级是否check
      if (!isCheck) {
        let isCheckNo = true
        for (let i = 0; i < this.checkRuleTableData.length; i++) {
          if (this.checkRuleTableData[i].parentId === parentId) {  
            if (this.checkRuleTableData[i].isCheck) {
              isCheckNo = false
              break
            }     
          }
        } 
        if (isCheckNo) {
          this.checkRuleTableData[firstParentIndex[parentId]].parentIsCheck = false
        }
      }
      this.styleRuleTable()
    },
    // 规则小类
    changeLevel3(childId, isCheck, id, parentId) {
      // 上级控制下级是否全部check
      for (let i = 0; i < this.checkRuleTableData.length; i++) {
        if (this.checkRuleTableData[i].id === id) {      
          let childrenArr = this.checkRuleTableData[i].children || []
          for (let j = 0; j < childrenArr.length; j++) {
            if (childrenArr[j].id === childId) {
              childrenArr[j].isCheck = isCheck
            }
          }             
        }
      }  
      for (let i = 0; i < this.checkRuleTableData.length; i++) {
        if (this.checkRuleTableData[i].parentId === parentId) {   
          this.checkRuleTableData[i].parentIsCheck = true
        }
        if (this.checkRuleTableData[i].id === id) {   
          this.checkRuleTableData[i].isCheck = true
        }
      } 
      // 下级控制上级是否check
      if (!isCheck) {
        let isCheckNo = true
        let index = -1
        for (let i = 0; i < this.checkRuleTableData.length; i++) {
          if (this.checkRuleTableData[i].id === id) {  
            index = i
            let childrenArr = this.checkRuleTableData[i].children || []
            for (let j = 0; j < childrenArr.length; j++) {
              if (childrenArr[j].isCheck) {
                isCheckNo = false
              }
            }             
          }
        }
        if (isCheckNo) {
          this.checkRuleTableData[index].isCheck = false
          this.changeLevel2(id, false, parentId)
        }        
      }        
      this.styleRuleTable()
    },
    // 选择全部规则样式过滤
    styleRuleTable() {
      let isNo = true
      let isAll = true
      for (let i = 0; i < this.checkRuleTableData.length; i++) {
        if (isNo === false && isAll === false) break;
        if (this.checkRuleTableData[i].isCheck) {
          isNo = false
        } else {
          isAll = false
        }
        let childrenArr = this.checkRuleTableData[i].children || []
        for (let j = 0; j < childrenArr.length; j++) {
          if (childrenArr[j].isCheck) {
            isNo = false
          } else {
            isAll = false
          }
        } 
      }
      if (!isAll && !isNo) {
        this.isAllRules = false
        this.isIndeterminate = true
      } else if (isAll && !isNo) {
        this.isAllRules = true
        this.isIndeterminate = false
      } else if (!isAll && isNo) {
        this.isAllRules = false
        this.isIndeterminate = false
      }
      this.changeRuleTable() {
        if (!this.checkRuleTableData || this.checkRuleTableData.length == 0) {
          return
        }
        this.$emit('changeRuleTable', this.checkRuleTableData, this.type)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.checkRuleTable {
  .el-table {
    .el-table__body-wrapper {
      overflow-x: hidden;
    }
    tbody {
      td {
        padding: 5px;
      }
      .childNode {
        display: inline-block;
        width: 220px;
      }
    }
    // 去除hover效果
    .el-table__body tr:hover > td {
      background-color: #fff;
    }
    .el-table__body tr.current-row > td {
      background-color: #fff;
    }
    .el-table--border td:first-child .cell,
    .el-table--border th:first-child .cell {
      padding: 0px;
    }
  }
}
</style>