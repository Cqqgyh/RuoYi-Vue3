import request from '@/utils/request.js'
import { parseStrEmpty } from "@/utils/ruoyi.js";

// 查询列表
export function getListPage(query) {
  return request({
    url: '/system/product/page',
    method: 'get',
    params: query
  })
}
// 查询列表
export function getListPageAll() {
  return request({
    url: '/system/product/list',
    method: 'get',
  })
}
// 新增
export function addRequest(data) {
  return request({
    url: '/system/product',
    method: 'post',
    data: data
  })
}

// 查询客户端详细
export function getDetailRequest(id) {
  return request({
    url: `/system/product/${parseStrEmpty(id)}`,
    method: 'get'
  })
}
// 查询预览详情页面
export function getViewDetailRequest(id) {
  return request({
    url: `/system/product/view-card/${parseStrEmpty(id)}`,
    method: 'get'
  })
}

// 修改
export function updateRequest(data) {
  return request({
    url: '/system/product',
    method: 'put',
    data: data
  })
}

// 删除
export function delRequest(id) {
  return request({
    url: `/system/product/single/${parseStrEmpty(id)}`,
    method: 'delete'
  })
}
// 批量删除
export function delBatchRequest(ids) {
  return request({
    url: `/system/product/${ids}`,
    method: 'delete'
  })
}
