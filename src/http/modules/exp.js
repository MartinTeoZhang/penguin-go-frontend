/*
 * 实验管理模块
 */

import axios from '../axios'

// 保存
export const save = (data) => {
  return axios({
    url: '/exp/save',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = (data) => {
  return axios({
    url: '/exp/delete',
    method: 'post',
    data
  })
}

// 分页查询
export const findPage = (data) => {
  return axios({
    url: '/exp/findPage',
    method: 'post',
    data
  })
}
