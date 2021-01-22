/**
 * @description: 成功信息提示
 */
const SuccessMessage = function(message) {
  this.$message({
    showClose: true,
    message: message,
    type: 'success'
  })
}

/**
 * @description: 错误信息提示
 */
const ErrorMessage = function(message) {
  this.$message({
    showClose: true,
    message: message,
    type: 'error'
  })
}

/**
 * @description: 警告信息提示
 */
const WarnMessage = function(message) {
  this.$message({
    showClose: true,
    message: message,
    type: 'warning'
  })
}

export {
  SuccessMessage,
  ErrorMessage,
  WarnMessage,
}