export default function (enumCode = '', target, isInt = false) {
  let result = []
  let enumList = this.$store.getters.getEnum(enumCode) || []
  if (!Array.isArray(target)) {
    return enumList
  }
  enumList.forEach(item => {
    if (target.findIndex(val => val == item.value) !== -1) {
      if (isInt) item.value = parseInt(item.value)
      result.push(item)
    }
  })
  return result
}