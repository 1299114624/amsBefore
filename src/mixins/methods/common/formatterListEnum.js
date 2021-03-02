export default function(enumCode, val) {
  val += ''
  return this.$store.getters.getEnumKV(enumCode, val)
}