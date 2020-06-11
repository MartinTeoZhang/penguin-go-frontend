/*
 * 实验管理模块
 */

import axios from '../axios'

// 保存
export const save = (data) => {
  return axios({
    url: '/funExp/save',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = (data) => {
  return axios({
    url: '/funExp/delete',
    method: 'post',
    data
  })
}

// 分页查询
export const findPage = (data) => {
  return axios({
    url: '/funExp/findPage',
    method: 'post',
    data
  })
}

// 查询实验用户集合
export const findExpUsers = (params) => {
  return axios({
    url: '/funExp/findExpUsers',
    method: 'get',
    params
  })
}

// 保存实验用户
export const saveExpUser = (data) => {
  return axios({
    url: '/funExp/saveExpUser',
    method: 'post',
    data
  })
}

// 查询实验的报名人数
export const getExpUserCount = (params) => {
  return axios({
    url: '/funExp/getExpUserCount',
    method: 'get',
    params
  })
}
