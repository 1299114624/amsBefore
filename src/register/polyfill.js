// 格式化日期
// new Date().Format('yyyy-MM-dd hh:mm:ss')
Date.prototype.Format = function(fmt) {
  let o = {
    "y+": this.getFullYear(),
    "M+": this.getMonth() + 1,  //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S+": this.getMilliseconds(), //毫秒
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      if (k === "y+") {
        fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length))
      } else if (k === "S+") {
        let lens = RegExp.$1.length
        lens = lens === 1 ? 3 : lens
        fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1, lens))
      } else {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
      }
    }
  }
  return fmt
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