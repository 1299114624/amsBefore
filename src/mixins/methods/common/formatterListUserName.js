export default function(userIds) {
  let userArr = userIds ? userIds.split(',') : []
  let userNames = userArr.map(v => {
    return this.$store.getters.getUserNameById(v)
  }).join(',')
  return userNames
}