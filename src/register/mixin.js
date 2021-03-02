import { methods } from 'mixins'

export default {
  methods: mergeManyObjToOneObj(methods)
}

/**
 * @description: 递归提取一个对象中所有函数
 * @param {*} obj 对象
 * @return {*}    所有函数都将被包装到这个对象中
 */
function mergeManyObjToOneObj(obj) {
  var newObj = {}
  if (obj && typeof obj === 'object') {
    for (let f in obj) {
      if (typeof obj[f] === 'function') {
        newObj[f] = obj[f]
      }
      if (typeof obj[f] === 'object') {
        Object.assign(newObj, mergeManyObjToOneObj(obj[f]))
      }
    }
  }
  return newObj
}