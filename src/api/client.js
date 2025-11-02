import request from '@/utils/request.js'
import { parseStrEmpty } from "@/utils/ruoyi.js";

// 查询列表
export function getListPage(query) {
  return request({
    url: '/system/client/page',
    method: 'get',
    params: query
  })
}
// 查询列表
export function getListPageAll() {
  return request({
    url: '/system/client/list',
    method: 'get',
  })
}
// 新增
export function addRequest(data) {
  return request({
    url: '/system/client',
    method: 'post',
    data: data
  })
}

// 查询客户端详细
export function getDetailRequest(id) {
  return request({
    url: `/system/client/${parseStrEmpty(id)}`,
    method: 'get'
  })
}

// 修改
export function updateRequest(data) {
  return request({
    url: '/system/client',
    method: 'put',
    data: data
  })
}

// 删除
export function delRequest(id) {
  return request({
    url: `/system/client/single/${parseStrEmpty(id)}`,
    method: 'post'
  })
}
