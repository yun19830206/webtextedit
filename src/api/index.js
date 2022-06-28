import request from '@/utils/request'
const Base64 = require('js-base64').Base64
const SERVICE_NAME = 'MinioAttachService'

// 获取地区信息
export function getDistrictInfo() {
  return request({
    url: '/EGB-ADMIN-BOOT/api/policySave/getDistrictInfo',
    method: 'get'
  })
}

// 预览图片
export function download(cuid) {
  return process.env.BASE_API + process.env.BASE_API_CTX + '/api/attachment/download/' + Base64.encode(cuid) + '?serviceName=' + SERVICE_NAME
}