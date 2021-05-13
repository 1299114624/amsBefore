<template>
  <div class='DIY_transfer'>
    <div class="left-tree">
      <div class="header">
        <div class="title">
          <span>{{ titles[0] }}</span>
          <el-button v-if="!firstRadio && !radioCheckbox" class="tree-btn" @click="selectAll" :disabled="allNodes.length === selectedData.length">全选</el-button>
        </div>
        <div class="seart-wrap">
          <el-input @input="leftSearch($event, 'diyTree')" v-model.trim="leftKeyWords" placeholder="搜索关键字" auto-complete="off" clearable>
            <i class="el-icon-search mr-5 pointer" slot="suffix"></i>
          </el-input>
        </div>
      </div>
      <div class="tree-wrap" id="transfer-tree">
        <el-scrollbar>
          <el-tree
           :data="useTreeData"
           :filter-node-method="filterNode"
           :default-expand-all="true"
           @check="checkNode"
           :check-strictly="checkStrictly"
           :node-key="nodeKey"
           :expand-on-click-node="!radioCheckbox"
           :show-checkbox="!firstRadio && !radioCheckbox"
           ref="diyTree"
          >
            <span slot-scope="{node,data}">
              <el-radio 
                v-if="data.radioKey && (firstRadio || radioCheckbox)"
                @change="selectFirstRadio($event, data.radioKey)"
                v-model="firstRadioCheckedVal[data.radioKey]"
                :label="data[nodeKey]"
              ></el-radio>
              <el-checkbox 
                v-if="data.checkboxKey && radioCheckbox"
                @change="selectDiyCheckbox($event, data, node, true)"
                v-model="data.checked"
              ></el-checkbox>
              <span class="tree-label">{{ data[aliasLabel] }}</span>
              <slot name="diyinfo"
                v-if="data[diyinfoLogo.key] === diyinfoLogo.value || (data.node && (data.node[diyinfoLogo.key] === diyinfoLogo.value))"
              ></slot>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="trans-footer">共{{allNodes.length}}个</div>
    </div>
    <div class="center-icon">
      <i class="el-icon-sort"></i>
    </div>
    <div class="right-result">
      <div class="header">
        <div class="title">
          <span>{{ titles[1] }}</span>
          <el-button v-if="!firstRadio && !radioCheckbox" class="tree-btn" @click="unSelectAll" :disabled="selectedData.length === 0">清空</el-button>
        </div>
        <div class="seart-wrap">
          <el-input v-model.trim="rightKeyWords" placeholder="搜索关键字" auto-complete="off" clearable>
            <i class="el-icon-search mr-5 pointer" slot="suffix"></i>
          </el-input>          
        </div>
      </div> 
      <div class="result-wrap">
        <p class="no-data" v-if="!selectedDataFilter.length && selectedData.length">无匹配数据</p>
        <p class="no-data" v-if="!selectedData.length">无数据</p>
        <el-scrollbar>
          <ul>
            <li @click="unCheckNode(node, index)" v-for="(node, index) in selectedDataFilter" :key="index">
              <span :class="{'module-color': node.type === 0}">{{node[aliasLabel]}}</span>
              <slot name="diyinfo"
                v-if="node[diyinfoLogo.key] === diyinfoLogo.value || (node.node && (node.node[diyinfoLogo.key] === diyinfoLogo.value))"
              ></slot>
            </li>
          </ul>
        </el-scrollbar>
      </div>  
      <div class="trans-footer">共{{selectedDataFilter.length}}个</div>   
    </div>
  </div>
</template>

<script>
export default {
  props: {
    titles: {
      type: Array,
      default() {
        return ['Source', 'Target']
      }
    },
    treeData: {
      type: Array,
      default() {
        return []
      }      
    },
    // 父子节点是否强关联，默认 false: 强关联
    checkStrictly: {
      type: Boolean,
      default: false
    },
    // 只包含一维子节点，且第二级为单选按钮
    firstRadio: {
      type: Boolean,
      default: false
    },
    // 第二级为单选，以下全为多选
    radioCheckbox: {
      type: Boolean,
      default: false
    },
    // 定制化唯一键值
    nodeKey: {
      type: String,
      default: 'id'
    },
    // 定制化label
    aliasLabel: {
      type: String,
      default: 'label'
    },
    // 定制化其它信息的标识，根据该字段显隐diyinfo
    diyinfoLogo: {
      type: Object,
      default() {
        return {
          key: '',
          value: '',
        }
      }
    },
  },
  data () {
    return {
      useTreeData: [],
      leftKeyWords: '',
      rightKeyWords: '',
      allNodes: [], // 所有有效节点
      selectedData: [],
      firstRadioCheckedVal: {},
    }
  },
  created() {
    this.useTreeData = this.treeData
    this.setFirstRadioVal(this.useTreeData) // 给单选数据分组
    this.getAllNodes(this.useTreeData)
  },
  watch: {
    treeData(val) {
      if (val.length) {
        this.useTreeData = val
        this.setFirstRadioVal(this.useTreeData) // 给单选数据分组
        this.getAllNodes(this.useTreeData)        
      }
    }
  }, 
  computed: {
    selectedDataFilter() {
      return this.selectedData.filter(item => {
        if (!this.rightKeyWords) {
          return item
        } else {
          return item[this.aliasLabel].indexOf(this.rightKeyWords) > -1
        }
      })
    }
  },
  methods: {
    // 重置数据
    resetTransfer(fold) {
      this.setDefaultVal([])
      this.leftKeyWords = ''
      this.$refs.diyTree.filter('')
      this.rightKeyWords = ''
      this.useTreeData = []
      this.firstRadioCheckedVal = {}
      // 是否折叠
      if (fold) {
        this.foldAll()
      }
    },
    // 设置默认选中项 []则取消所有勾选
    setDefaultVal(defaultVal) {
      if (Array.isArray(defaultVal)) {
        this.$refs.diyTree.setCheckedKeys(defaultVal)
        this.setSelectedData()
      }
    },
    getCheckedNodes() {
      return this.selectedData
    },
    // 折叠所有
    foldAll() {
      let allNodes = this.$refs.diyTree.store._getAllNodes()
      for (let i = 0; i < allNodes.length; i++) {
        allNodes[i].expanded = false
      }
    },
    // ==============================================================
    // 给radio分组，设置selectedData默认值
    setFirstRadioVal(treeData) {
      // 暂时用id作为唯一键值，定制化key值需要做相应配置
      if(this.firstRadio) {
        treeData.forEach(item => {
          this.$set(this.firstRadioCheckedVal, item.id, item.value)
          if (item.value) {
            if (!this.selectedData.some(el => item.children.some(v => v.id === el.id))) { 
              this.selectedData.push(_.find(item.children, o => o.id === val))
            }
          }
        })
      }
    },
    // 获取所有node节点对象
    getAllNodes(treeData) {
      let allNodes = []
      if (this.firstRadio) {
        iteration(treeData, 1)
      } else if (this.radioCheckbox) {
        iteration(treeData, 2)
      } else {
        iteration(treeData, 3)
      }
      this.allNodes = allNodes
      function iteration(data, type) {
        data.forEach(item => {
          if (type === 1) {
            if (item.hasOwnProperty('radioKey')) {
              allNodes.push(item)
            }
          }
          if (type === 2) {
            if (item.hasOwnProperty('checkboxKey')) {
              allNodes.push(item)
            }
          }
          if (type === 3) {
            if (!item.disabled) {
              allNodes.push(item)
            }
          }
          if (item.children && item.children.length) {
            iteration(item.children, type)
          }
        })
      }
    },  
    checkNode(checked, treeStatus) {  //checked--该节点对应对象，treeStatus--树目前的选中状态对象（checkedNodes、checkedKeys）
      let selected = treeStatus.checkedKeys.indexOf(checked[this.nodeKey])
      if (this.checkStrictly) {
        // 子节点选中，相关父节点和子节点全勾选上
        if (selected > -1) {
          this.setParent(checked, true)
          this.setChildren(checked, true)
        } else {
          // 取消选择，子节点全部取消
          this.setChildren(checked, false)
        }
      }
      this.setSelectedData()
    },  
    setParent(checked) {
      let currentNodes = this.$refs.diyTree.getNode(checked)
      // 如果还不是一级节点
      if (!currentNodes.data.first) {
        let parentNode = currentNodes.parent
        if (!parentNode.data.disabled) {
          this.$refs.diyTree.setChecked(parentNode, true)
          this.setParent(parentNode)
        }
      }
    },
    setChildren(unChecked, isSelected) {
      this.$refs.diyTree.setChecked(unChecked[this.nodeKey], isSelected)
      if (unChecked.children) {
        for (let i = 0; i < unChecked.children.length; i++) {
          this.setChildren(unChecked.children[i], isSelected)
        }
      }
    },
    selectAll() {
      for (let i = 0; i < this.allNodes.length; i++) {
        const el = this.allNodes[i]
        this.$refs.diyTree.setChecked(el, true)
      }
      this.setSelectedData()
    },    
    unSelectAll() {
      // 单选按钮单独处理
      if (this.firstRadio) {
        for (let key in this.firstRadioCheckedVal) {
          this.firstRadioCheckedVal[key] = ''
          this.selectedData = []
        }
      } else {
        for (let i = 0; i < this.selectedData.length; i++) {
          const el = this.selectedData[i]
          this.$refs.diyTree.setChecked(el, false)
        }
      }
      this.setSelectedData()
    },
    unCheckNode(data, index) {
      // 单选按钮单独处理
      if (this.firstRadio) {
        this.firstRadioCheckedVal[data.radioKey] = ''
        this.selectedData.splice(index, 1)
      } else if (this.radioCheckbox) {
        this.selectedData.splice(index, 1)
        this.selectDiyCheckbox(false, data, undefined, false)
      } else {
        this.setChildren(data, false)
        this.setSelectedData()
      }  
    },
    setSelectedData() {
      let selectedNodes = this.$refs.diyTree.getCheckedNodes()
      // 父子节点非强关联，过滤掉父节点
      if (!this.checkStrictly) {
        selectedNodes = selectedNodes.filter(item => !item.children)
      }
      this.selectedData = selectedNodes
    },    
    filterNode(val, data) {
      if (!val) return true
      return data[this.aliasLabel].indexOf(val) !== -1
    },
    leftSearch(val, treeName) {
      this.$refs[treeName].filter(val)
    },
    // 勾选获取消勾选单选框（还要把其它组的复选框check置为false）
    selectFirstRadio(val, key) {
      let self = this
      if (this.firstRadio) {
        // 一维单选
        let treeData = this.useTreeData
        let fatherNode = _.find(treeData, o => o.id === key)
        let children = fatherNode.children || []
        let item = _.find(children, o => o.id === key)
        // 如果已经有组成员，替换
        let _index = _.findIndex(this.selectedData, o => o.radioKey === item.radioKey)
        if (_index !== -1) {
          this.$set(this.selectedData, _index, item)
        } else {
          // 如果没有，则直接推入
          this.selectedData.push(item)
        }
      } else if (this.radioCheckbox) {
        // 单选复选混合
        let cloneData = _.cloneDeep(this.useTreeData)
        let children =  cloneData.find(item => item.id === key).children
        for (let i = 0; i < children.length; i++) {
          const el = children[i]
          //如果不是当前组则全部check为false
          if (el.id !== val) {
            const childrenIn = el.children
            setCheckbox(childrenIn)
          }
        }
        this.useTreeData = cloneData
        this.getAllSelected(this.useTreeData)
        function setCheckbox(treeData) {
          for (let i = 0; i < treeData.length; i++) {
            const el = treeData[i]
            if (el.hasOwnProperty('checkboxKey')) {
              el.checked = false
            }
            if (el.children && el.children.length) {
              setCheckbox(el.children)
            }
          }
        }
      }
    },
    // 勾选或取消单选下的多选框
    selectDiyCheckbox(selected, data, node, setData) {
      let self = this
      if (selected) {
        let firstParentId = ''
        this.selectedData.push(data)
        this.$set(this.firstRadioCheckedVal, data.grandRadioKey, data.checkboxKey)
        // 把其它组的复选框checked置为false
        this.selectFirstRadio(data.checkboxKey, data.grandRadioKey)
        // 把所有父节点勾上
        let parentNode = node.parent
        let parentKeys = []
        getParentKeys(parentNode)
        let cloneData = _.cloneDeep(this.useTreeData)
        setParentCheckbox(cloneData, parentKeys)
        this.useTreeData = cloneData
      } else {
        // 把下级节点全部checked置为false
        if (this.setData) {
          if (data.children && data.children.length) {
            unCheckedAllChildren(data.children)
          }
        } else {
          let grandData = {}
          let cloneData = _.cloneDeep(this.useTreeData)   
          for (let i = 0; i < cloneData.length; i++) {
            if (data.grandRadioKey === cloneData[i].id) {
              grandData = cloneData[i]
              break
            }
          } 
          let radioParentId = data.checkboxKey
          let radioChildren = grandData.children
          let checkboxGroup = {}      
          if (radioChildren && radioChildren.length) {
            for (let j = 0; j < radioChildren.length; j++) {
              const el = radioChildren[j]
              if (el.id === radioParentId) {
                checkboxGroup = el
                break
              }
            }
          }
          let checkboxItem = checkboxGroup.children
          setDeepCheckbox(checkboxItem)
          this.useTreeData = cloneData
          this.getAllSelected(this.useTreeData)
        }
      }
      if (setData) {
        this.getAllSelected(this.useTreeData)
      }
      function getParentKeys(node) {
        // 该节点是checkbox
        let data = node.data
        if (data.hasOwnProperty('radioKey')) {
          firstParentId = data.id // 一级父节点id
        }
        if (data.hasOwnProperty('checkboxKey')) {
          parentKeys.push(data.id)
        }
        if (node.parent) {
          getParentKeys(node.parent)
        }
      }
      function setParentCheckbox(treeData, parentKeys) {
        treeData.forEach(item => {
          if (item.hasOwnProperty('checkboxKey')) {
            if (parentKeys.includes(item.id) && firstParentId === item.checkboxKey) {
              item.checked = true
            }
          }
          if (item.children && item.children.length) {
            setParentCheckbox(item.children, parentKeys)
          }
        })
      }      
      function unCheckedAllChildren(treeData) {
        treeData.forEach(item => {
          if (item.hasOwnProperty('checkboxKey')) {
            item.checked = false
            if (item.children && item.children.length) {
              unCheckedAllChildren(item.children)
            }
          }
        })
      }
      function setDeepCheckbox(checkboxGroup) {
        for (let k = 0; k < checkboxGroup.length; k++) {
          const checkbox = checkboxGroup[k]
          // 不是最底层checkbox
          if (checkbox.children && checkbox.children.length) {
            if (checkbox.id === data.id) {
              checkbox.checked = false
              unCheckedAllChildren(checkbox.children)
              break
            } else {
              setDeepCheckbox(checkbox.children)
            }
          } else {
            // 最底层checkbox
            if (checkbox.id === data.id) {
              checkbox.checked = false
              break
            }
          }
        }
      }
    },
    // 遍历获取勾选数据
    getAllSelected(treeData) {

    },
  }
}
</script>

<style lang='scss' scoped>
.DIY_transfer {
  width: 496px;
  height: 328px;
  display: flex;
  justify-content: space-between;
  .left-tree, .right-result {
    width: 218px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    .title {
      height: 30px;
      font-size: 14px;
      text-align: center;
      line-height: 30px;
      position: relative;
      color: #909399;
      .tree-btn {
        position: absolute;
        right: 0;
        padding: 3px 5px;
        top: 5px;
        right: 10px;
      }
    }
    .seart-wrap {
      padding: 0 10px;
      .el-icon-search, .el-input__icon {
        color: #4183d7;
        line-height: 28px;
      }
      .el-icon-error {
        font-size: 10px !important;
      }
    }
    .tree-wrap, .result-wrap {
      border-top: 1px solid #ebeef5;
      position: absolute;
      width: 100%;
      left: 0;
      top: 61px;
      bottom: 24px;
      overflow: hidden;
      .tree-label {
        color: #000;
      }
      .module-color {
        color: #777999;
      }
      .no-data {
        font-size: 14px;
        color: #909399;
        text-align: center;
        margin-top: 5px;
      }
      ul {
        li {
          padding: 2px 10px;
          line-height: 18px;
          cursor: pointer;
          &:hover {
            span {
              color: #4183d7;
            }
            background: #d1f0ff;
          }
        }
      }
      /deep/ .el-tree {
        display: inline-block;
        min-width: 210px;
        /deep/ .el-checkbox__inner {
          background: #d1f0ff;
          width: 14px;
          height: 14px;
        }
        /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
          background: #4183d7;
          border-color: #4183d7;
        }
        /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background: #4183d7;
          border-color: #4183d7;
        }
        /deep/ .el-tree-node__label {
          font-size: 12px;
          color: #000;
        }
      }
    }
    .trans-footer {
      height: 24px;
      line-height: 24px;
      background: #f5f5f5;
      margin: 0;
      padding: 0 10px;
      border-top: 1px solid #ebeef5;
      width: 100%;
      z-index: 1;
      position: absolute;
      bottom: 0;
      box-sizing: border-box;
      color: #909399;
    }
  }
  .center-icon {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    .el-icon-sort {
      transform: rotate(90deg);
    }
  }
}
</style>