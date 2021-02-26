import * as types from './mutation_types'
import {ajax, store} from 'utils'
import {gbs} from 'config'
import {getAllDicts as apiDicts, getServerOsInfo as serverInfo, getSystemInfo as systemInfo} from 'apis/global/index'
export default {
  // 加载字典
  enumDicts_load: ({commit}) => {
    return new Promise(resolve => {
      ajax({
        path: apiDicts.path,
        type: apiDicts.type,
        fn: data => {
          store.set('enumDicts', data)          // 更新到localstorage
          commit(types.ENUMDICT_UPDATE, data)    // 更新到 vuex
          resolve()
        }
      })      
    })
  },
  // 获取字典值
  getEnum: ({state, commit}, key) => {
    key = key + ''
    const getEnumData = (dicts, key) =>{
      let data = []
      dicts.forEach(item => {
        if (key === item[gbs.enumDicts_key_field]) {
          data = _.cloneDeep(item.enums)
        }
      })
      return data
    }
    return new Promise(resolve => {
      if (state.enumDicts.length <= 0) {
        let enumDictsData = store.get('enumDicts')
        if (enumDictsData) {
          commit(types.ENUMDICT_UPDATE, enumDictsData)    // 更新到 vuex
          resolve(getEnumData(state.enumDicts, key))     
        } else {
          ajax({
            path: apiDicts.path,
            type: apiDicts.type,
            fn: data => {
              store.set('enumDicts', data)          // 更新到localstorage
              commit(types.ENUMDICT_UPDATE, data)    // 更新到 vuex
              resolve(getEnumData(state.enumDicts, key))
            }
          })
        }
      } else {
        resolve(getEnumData(state.enumDicts, key))
      }
    })
  }
}