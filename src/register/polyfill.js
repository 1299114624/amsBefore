// 格式化日期
// new Date().Format('yyyy-MM-dd hh:mm:ss')
Date.prototype.Format = function(fmt) {}

// 数组过滤器
// array.filter(function(val){ return val._score >= 0.5 })
Date.prototype.Format = function(fmt) {}
if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun) {}
}

//去空格
if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '')
  }
}

//去掉所有空格
if (!String.prototype.trimAll) {
  String.prototype.trimAll = function() {
    return this.replace(/\s+/g, '')
  }
}