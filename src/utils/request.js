import axios from 'axios'

const showStatus = (status) => {
  let message = ''
  switch (status) {
    case 400:
      message = '请求错误(400)'
      break
    case 401:
      message = '未授权，请重新登录(401)'
      break
    case 403:
      message = '拒绝访问(403)'
      break
    case 404:
      message = '请求出错(404)'
      break
    case 408:
      message = '请求超时(408)'
      break
    case 500:
      message = '服务器错误(500)'
      break
    case 501:
      message = '服务未实现(501)'
      break
    case 502:
      message = '网络错误(502)'
      break
    case 503:
      message = '服务不可用(503)'
      break
    case 504:
      message = '网络超时(504)'
      break
    case 505:
      message = 'HTTP版本不受支持(505)'
      break
    default:
      message = `连接出错(${status})`
  }
  return `${message}，请检查网络或联系管理员`
}

const service = axios.create({
  baseURL: process.env.VUE_APP_BASIC_API,
  timeout: 600000,
  validateStatus: function () {
    return true
  }
})

service.interceptors.request.use((config) => {
  config.headers['Access-Token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoie1wiYWN0aW9uSWRcIjpcIjhjOTQyMjI2LTY2MDctNGIwYS05MzA2LWI0MjgwZmE0YTVjMFwiLFwiYWRtaW5cIjp0cnVlLFwiYXBwQ29kZVwiOlwiZWdiXCIsXCJjdWlkXCI6XCItOTlcIixcImV4dHNcIjp7fSxcIm9yZ0NvZGVcIjpcIlwiLFwib3JnTmFtZVwiOlwi5YWo6YOoXCIsXCJyZWxhdGVkT3JnQ3VpZFwiOlwiMFwiLFwicmVxdWVzdElwXCI6XCIxNzIuMTcuMC4xXCIsXCJyZXF1ZXN0VXJpXCI6XCIvYXBpL2FkbWluL3VzZXIvaW5pdFwiLFwic2hvd05hbWVcIjpcIuWkmuWVpkHmoqZcIixcInN1cGVyVXNlclwiOnRydWUsXCJ1aWRcIjpcIjg5ZTVkNTYzNTRlNTA0ZDEwZjI1YjQ1NjYzMDI3MzA3XCIsXCJ1c2VyTmFtZVwiOlwiZG9yYWVtb25cIn0ifQ.8zrc5E4LKxldxTTfpd998JyxbVmYtENrjRDOvsqa59o'
  config.headers['Access-Uid'] = 'f58dddff07185dfa195ee9c53b11d42d'
  return config
}, (error) => {
  error.data = {}
  error.data.msg = '服务器异常，请联系管理员'
  return Promise.resolve(error)
})

service.interceptors.response.use((response) => {
  const status = response.status
  let msg = ''
  if (status < 200 || status >= 300) {
    msg = showStatus(status)
    if (typeof response.data === 'string') {
      response.data = { msg }
    } else {
      response.data.msg = msg
    }
  }
  return response.data
}, (error) => {
  error.data = {}
  error.data.msg = '请求超时或服务器异常，请检查网络或联系管理员'
  return Promise.resolve(error)
})

export default service
