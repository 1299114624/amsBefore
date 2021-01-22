import { ajax } from 'utils/'
import { formatThousand } from 'utils/formatters'
import request from 'apis'
import pathToRegexp from 'path-to-regexp'
import { SuccessMessage, ErrorMessage, WarnMessage} from './message'

var plugins = {}

// 全局注入api请求函数，直接调用this.$$api_module名称_method名称
for (let i = 0; i < request.length; i++) {
  if (typeof request[i] === 'object' && request[i].list && Array.isArray(request[i].list)) {
    for(let j = 0; j < request[i].length; j++) {
      plugins['api_' + request[i].module + '_' +request[i].list[j].method] = (function(n, m) {
        return function({
          type = request[n].list[m].type,
          path = request[n].list[m].path,
          download = request[n].list[m].download,
          rescode = request[n].list[m].rescode,
          data,
          fn,
          errFn,
          headers,
          opts,
          restParam = {}
        } = {}) {
          // 解析restful url
          const generatePath = pathToRegexp.compile(path)
          path = generatePath(restParam)
          ajax.call(this, {
            type,
            path,
            data,
            rescode,
            fn,
            download,
            errFn,
            headers,
            opts
          })
        }
      })(i, j)
    }
  }
}

/**
 * @description: 通用查询配置
 * @param {Object} matchFields    查询过滤条件
 * @param {number} pageNumber     页码
 * @param {number} pageSize       每页记录数
 * @param {string} key            排序关键字段
 * @param {string} sortType       排序类型 (ASC\DESC)
 */
plugins['GET_COMMON_QUERY_PARAM'] = function(matchFields = {}, pageNumber, pageSize, key, sortType) {
  pageNumber = pageNumber || 1
  pageSize = pageSize || 10
  key = key || 'id'
  sortType = sortType === 'descending' ? 'DESC' : sortType === 'ascending' ? 'ASC' : 'DESC'
  // 参数trim()化
  let _matchFields = _.cloneDeep(matchFields)
  for (let key in _matchFields) {
    if (_matchFields.hasOwnProperty(key)) {
      if (typeof(_matchFields[key]) === 'string') {
        _matchFields[key] = _matchFields[key].trim();
      }
    }
  }
  return {
    query: _matchFields,
    page: {
      pageNumber: pageNumber,
      pageSize: pageSize,
    },
    sort: {
      key,
      sortType
    }
  }
}

/**
 * 表格千分位formatter函数
 */
plugins['formatThousand'] = formatThousand

/**
 * @description: 获取token验证
 */
plugins['getToken'] = function() {
  let token = {
    usertoken: window.localStorage.getItem("af_token"),
    userid: window.localStorage.getItem("af_userId"),
    username: window.localStorage.getItem("af_userName"),
  }
  return token;
}

/**
 * @description: 提示信息
 */
plugins['SuccessMessage'] = SuccessMessage;
plugins['ErrorMessage'] = ErrorMessage;
plugins['WarnMessage'] = WarnMessage;

export default plugins