/*
 * 用户管理模块
 */

import axios from '../axios'

export const getUser = () => {
  return axios({
    url: '/user',
    method: 'get'
  })
}
