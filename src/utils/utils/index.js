/**
 * @description: 获取表格删除数据之后 pageNumber 的值
 * （1）如果删除的数据条数小于当前页数据总数，不重置
 * （2）如果删除的数据条数等于当前页数据总数，如果后一页还有数据（即当前页不是最后一页）则不重置，反之（当前页是最后一页）页码减1，回到前一页
 * @param {*} list  当前页所有数据
 * @param {*} deleteList  删除的数据
 * @param {*} totalCount  数据总数
 * @param {*} pageNumber  当前页码
 * @param {*} pageSize  每页几条数据
 * @return {*}  返回 pageNumber 的值
 */
export function getPageNumber({list = [], deleteList = [], totalCount = 0, pageNumber = 1, pageSize = 10} = {}) {
  if (totalCount - deleteList.length == (pageNumber - 1) * pageSize) {
    return pageNumber > 1 ? pageNumber - 1 : 1
  } else {
    return pageNumber
  }
}