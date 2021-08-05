import {hasPermission} from 'utils/permission'

export default {
  inserted: function(el, binding, vnode, oldVnode) {
    if (!hasPermission(binding.value)) el.parentNode.removeChild(el)
  }
}