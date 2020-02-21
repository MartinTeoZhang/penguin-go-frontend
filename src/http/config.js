// config.js：axios 默认配置，包含基础路径等信息。

import * as global from '@/utils/global'

export default {
  method: 'get',
  // 基础url前缀
  baseURL: global.baseURL,
  // 请求头信息
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  // 参数
  data: {},
  // 设置超时时间
  timeout: 10000,
  // 携带凭证
  withCredentials: true,
  // 返回数据类型
  responseType: 'json'
}
