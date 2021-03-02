const englishName_reg = value => {
  let reg = /^[A-Za-z\+\*&_.-\/@#!%$?:;, |=-]+$/
  return reg.test(value)
}

export default {
  englishName_reg,
}