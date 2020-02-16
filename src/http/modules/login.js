/*
 * 系统登录模块
 */

import axios from '../axios'

// 登录
export const login = data => {
  return axios({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 登出
export const logout = () => {
  return axios({
    url: '/sys/logout',
    method: 'get'
  })
}

