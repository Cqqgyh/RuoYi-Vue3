import request from '@/utils/request.js'
import { parseStrEmpty } from "@/utils/ruoyi.js";

// 查询列表
export function getListPage(query) {
  return request({
    url: '/system/quotation/batch/page',
    method: 'get',
    params: query
  })
}
// 查询列表
export function getListPageAll() {
  return request({
    url: '/system/quotation/batch/list',
    method: 'get',
  })
}
// 新增
export function addRequest(data) {
  return request({
    url: '/system/quotation/batch',
    method: 'post',
    data: data
  })
}

// 查询客户端详细
export function getDetailRequest(id) {
  return request({
    url: `/system/quotation/batch/${parseStrEmpty(id)}`,
    method: 'get'
  })
}

// 修改
export function updateRequest(data) {
  return request({
    url: '/system/quotation/batch',
    method: 'put',
    data: data
  })
}

// 删除
export function delRequest(id) {
  return request({
    url: `/system/quotation/batch/single/${parseStrEmpty(id)}`,
    method: 'DELETE'
  })
}
// 批量删除
export function delBatchRequest(ids) {
  return request({
    url: `/system/quotation/batch/${ids}`,
    method: 'delete'
  })
}
