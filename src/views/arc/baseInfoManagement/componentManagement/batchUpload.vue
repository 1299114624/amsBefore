<template>
  <el-dialog
    title="批量导入"
    :visible.sync="show"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="520px"
    custom-class="batchUpload-dialog">
    <div class="wrapper">
      <template v-if="step === 1">
        <el-upload
          class="uploadBox"
          :action="uploadUrl"
          :on-remove="handleRemoveFile"
          :before-upload="handleBeforeUpload"
          :on-success="handleUploadSuccess"
          :file-list="fileList"
          :on-error="uploadErr"
          :limit="1">
          <el-button size="small" type="primary">上传账户信息文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传一个 excel 文件，且文件大小不超过 10MB</div>
        </el-upload>
      </template>
      <template v-else>
        <div class="parsingBox" v-if="isParsing">
          <p class="parsing__title">解析中, 请稍后...</p>
          <i class="el-icon-loading"></i>
        </div>
        <div class="resultBox" v-else>
          <div class="result__statistics">
            <section>
              <span class="statistics__item">执行{{parsingData.total}}条</span>
              <span class="statistics__item"><em class="is-success">{{parsingData.success}}</em>条成功</span>
              <span class="statistics__item"><em class="is-failure">{{parsingData.error}}</em>条失败</span>
            </section>
          </div>
          <div class="result__failure">
            <p class="failure__title">失败详情如下：<el-button type="text" @click="handleExportError" v-if="parsingData.errorList.length>0">下载失败数据</el-button></p>
            <el-table
              class="noBorder"
              :data="parsingData.errorList"
              border
              stripe
              height="180px"
              style="width:100%">
              <el-table-column align="center" label="行号" prop="lineNumber" width="80"></el-table-column>
              <el-table-column align="center" label="证券账户" prop="accountId" width="80"></el-table-column>
              <el-table-column align="center" label="失败原因" prop="errorInfo" min-width="120">
                <template slot-scope="{row}">
                  <p v-for="(item,index) in row.errorInfo" :key="index">{{item}}</p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </div>
    <div slot="footer">
      <template v-if="step == 1">
        <el-button type="primary" :disabled="files.length == 0" @click="handleImport">导入</el-button>
        <el-button @click="handleClose">取消</el-button>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import {gbs} from "config/"
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      show: this.isVisible,
      fileList: [],
      files: [],
      uploadUrl: gbs.fileUploadPath,
      downloadUrl: gbs.fileDownloadPath,
      step: 1,
      isParsing: false,
      parsingData: {
        total: 0,
        success: 0,
        error: 0,
        errorList: []
      }
    }
  },
  watch: {
    isVisible(val) {
      this.show = val
    },
    show(val) {
      if (!val) {
        this.close()
      }
    }
  },
  destroyed() {
    this.close()
  },
  methods: {
    close() {
      this.$emit("update:isVisible", false)
      this.step = 1;
      this.isParsing = false;
      this.fileList = [];
      this.files = []
    },
    /**
     * 上传附件之前进行格式校验
     */
    handleBeforeUpload(file) {
      console.log(file);
      const reg = /\.(xls|xlsx)$/
      const isExcel = reg.test(file.name)
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isExcel) this.$$ErrorMessage('只能上传 .xls 或者 .xlsx 格式的文件！')
      if (!isLt10M) this.$$ErrorMessage('上传的文件大小不能超过 10MB！')
      return isExcel && isLt10M
    },
    /**
     * 上传附件之前进行格式校验
     */
    handleUploadSuccess(res, file, fileList) {
      // 如果上传失败，提示并清空附件
      if (res.code && res.code != '0') {
        fileList.splice(fileList.indexOf(file), 1);
        this.$$ErrorMessage(res.msg)
      } else {
        let info = {
          name: res.fileName,
          fileId: res.id,
          fileCode: res.fileCode
        }
        this.files.push(info)
      }
    },
    /**
     * 移除附件的回调 file移除的附件信息  fileList剩下的附件列表
     */
    handleRemoveFile(file, fileList) {
      let fileId = file.response ? file.response.id : file.fileId
      let index = this.files.findIndex(item => item.fileId === fileId)
      if (index != -1) this.files.splice(index, 1)
    },
    uploadErr(err, file, fileList) {
      this.$$ErrorMessage(err.message)
    },
    /**
     * 导入，先进行解析，解析成功之后获取结果
     */
    handleImport() {
      let self = this
      this.step = 2
      this.isParsing = true
      const importAccount = async function() {
        let parsing = await self.handleParsing()
        let result = await self.getParsingResult()
        return {parsing, result}
      }
      importAccount().then(data => {
        this.isParsing = false;
        // 解析完成并获取解析结果之后，处理解析结果
        this.formatResult(data.result)
      }).catch(err => {
        // 返回第一步
        this.step = 1
        this.isParsing = false
        // 重新显示
        this.fileList = []
        if (err) {
          this.$$ErrorMessage(err.message)
        }
      })
    },
    /**
     * 导入文件进行解析
     */
    handleParsing() {
      return new Promise((resolve, reject) => {
        this.$$api_component_batchImport({
          data: {fileCode: this.files[0].fileCode},
          fn: data =>{
            resolve()
            this.$emit('confirm')
          },
          errFn: err => {
            reject(err.msg)
          }
        }) 
      })
    },
    /**
     * 获取解析结果
     */
    getParsingResult() {
      return new Promise((resolve, reject) => {
        this.$$api_component_getResult({
          data: {fileCode: this.files[0].fileCode},
          fn: data =>{
            resolve(data || [])
          },
          errFn: err => {
            reject(err.msg)
          }
        })         
      })
    },
    /**
     * 处理解析结果，获取解析数量统计以及错误信息
     */
    formatResult(result) {
      let [total, success, error, errorList] = [0, 0, 0, []]
      result.forEach(item => {
        if (item.isSuccess === 'Y') {
          success += 1
        } else {
          error += 1
          item.errorInfo = JSON.parse(item.errorInfo)
          errorList.push({
            lineNumber: item.lineNumber,
            accountId: item.accountId,
            errorInfo: Object.keys(item.errorInfo).map(key => `${key}-${item.errorInfo[key]}`)
          })
        }
      })
      total = success + error
      this.parsingData = {total, success, error, errorList}
    },
    /**
     * 导出解析失败的数据
     */
    handleExportError() {
      this.$$api_component_exportError({
        data: {fileCode: this.files[0].fileCode},
        fn: data =>{},
      }) 
    },
    handleClose() {
      this.close()
      this.$emit('cancel')
    }
  }
}
</script>

<style lang='scss' scoped>
.batchUpload-dialog {
  .wrapper {
    min-height: 100px;
    .uploadBox {
      .el-upload__tip {
        font-size: 12px;
        color: #606266;
        margin-top: 7px;
      }
    }
    .parsingBox {
      text-align: center;
      .parsing__title {
        margin: 20px 0;
      }
      .el-icon-loading {
        font-size: 30px;
      }
    }
    .resultBox {
      .result__statistics {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        color: #000;
        .statistics__item {
          margin-right: 20px;
        }
        .is-success {
          color: #409eff;
        }
        .is-failure {
          color: #f56c6c;
        }
      }
    }
    .result__failure {
      .failure__title {
        font-size: 12px;
        margin-bottom: 5px;
      }
    }
  }
  /deep/ .el-dialog__footer {
    > div {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>