import request from '@/utils/request.js'
import { parseStrEmpty } from "@/utils/ruoyi.js";

// 查询列表
export function getListPage(query) {
  return request({
    url: '/system/sample-category/page',
    method: 'get',
    params: query
  })
}
// 查询列表
export function getListPageAll(query) {
  return request({
    url: '/system/sample-category/list',
    method: 'get',
    params: query
  })
}
// 新增
export function addRequest(data) {
  return request({
    url: '/system/sample-category',
    method: 'post',
    data: data
  })
}

// 查询客户端详细
export function getDetailRequest(id) {
  return request({
    url: `/system/sample-category/${parseStrEmpty(id)}`,
    method: 'get'
  })
}

// 修改
export function updateRequest(data) {
  return request({
    url: '/system/sample-category',
    method: 'put',
    data: data
  })
}

// 删除
export function delRequest(id) {
  return request({
    url: `/system/sample-category/single/${parseStrEmpty(id)}`,
    method: 'delete'
  })
}
// 批量删除
export function delBatchRequest(ids) {
  return request({
    url: `/system/sample-category/${ids}`,
    method: 'delete'
  })
}
// 样品分类-查询产品列表
export function getProductListPageByCategoryId(categoryId) {
  return request({
    url: `/system/sample-category/product-list/${categoryId}`,
    method: 'get',
  })
}
