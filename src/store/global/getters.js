import { gbs } from 'config'
export default {
  getEnumKV(state, getters) {
    return (enumCode, val) => {
      const getEnumData = (dicts, code, value) => {
        let data = ''
        dicts.forEach(item => {
          if (code === item[gbs.enumDicts_key_field]) {
            item.enums.forEach(enumData => {
              if (value === enumData.value) {
                data = enumData.name
              }
            })
          }
        })
        return data
      }
      return getEnumData(state.enumDicts, enumCode, val)
    }
  },
  // 根据字典enum_name找val
  getEnumVal(state, getters) {
    return (enumCode, val) => {
      const getEnumName = (dicts, code, name) => {
        let data = ''
        dicts.forEach(item => {
          if (code === item[gbs.enumDicts_key_field]) {
            item.enums.forEach(enumData => {
              if (name === enumData.enum_name) {
                data = enumData.value
              }
            })
          }
        })
        return data
      }
      return getEnumName(state.enumDicts, enumCode, val)
    }
  },
  getEnum(state, getters) {
    return key => {
      let dicts = state.enumDicts
      let data = []
      dicts.forEach(item => {
        if (key === item[gbs.enumDicts_key_field]) {
          data = _.cloneDeep(item.enums)
        }
      })
      return data
    }
  },
  getUserNameById(state, getters) {
    return userId => {
      let userList = state.userList
      let data = ''
      userList.forEach(item => {
        if (userId === item.id) {
          data = _.cloneDeep(item.realName)
        }
      })
      return data
    }
  },
}