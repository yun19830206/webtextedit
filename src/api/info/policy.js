import request from '@/utils/request'

// 填报结果公共查询封装
export function materialsResultQuery(url, data) {
  return request({
    url: url,
    method: 'get',
    params: data
  })
}

// 政策详情
export function getPolicyDetail(cuid) {
  return request({
    url: '/EGB-ADMIN-BOOT/api/info/cms/getPolicyDetail/' + cuid,
    method: 'get'
  })
}