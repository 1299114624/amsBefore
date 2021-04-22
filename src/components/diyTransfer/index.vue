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
                v-if="data[diyinfoLogo.key] === diyinfoLogo.value || (data.node && (data.node[diyinfoLogo.key] === diyinfoLogo.value))"
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
    // 勾选获取消勾选单选框（还要把其它组的复选框反选）
    selectFirstRadio() {

    },
    // 勾选获取消单选下的多选框
    selectDiyCheckbox() {

    },
    // 遍历获取勾选数据
    getAllSelected(treeData) {

    },
  }
}
</script>

<style lang='scss' scoped>
.DIY_transfer {
  height: 100%;
  .el-icon-sort {
    transform: rotate(90);
  }
}
</style>