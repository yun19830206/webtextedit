import request from '@/utils/request'

// 获取推荐政策
export function getRemmendPolicy() {
  return request({
    url: '/api/policy/portal/getRemmendPolicy',
    method: 'get'
  })
}

// 获取最新政策
export function getLatestPolicy() {
  return request({
    url: '/api/policy/portal/getLatestPolicy',
    method: 'get'
  })
}

// 获取政策搜索条件
export function getSearchConditions() {
  return request({
    url: '/api/policy/portal/getSearchConditions',
    method: 'get'
  })
}

// 获取搜索数据
export function getSerchData(params) {
  return request({
    url: '/api/policy/portal/getSerchData',
    method: 'post',
    data: params
  })
}
