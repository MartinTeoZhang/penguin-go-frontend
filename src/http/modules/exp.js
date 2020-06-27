/*
 * 实验模块
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

// 删除已报名的被试
export const batchPeoDelete = (data) => {
  return axios({
    url: '/funExp/deletePeo',
    method: 'post',
    data
  })
}

// 删除已报名的被试
export const deletePeoByExpIdAndUserName = (data) => {
  return axios({
    url: '/funExp/deletePeoByExpIdAndUserName',
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

// 查询实验被试集合
export const findExpUsers = (params) => {
  return axios({
    url: '/funExp/findExpUsers',
    method: 'get',
    params
  })
}

// 查询实验被试
export const findExpUserById = (params) => {
  return axios({
    url: '/funExp/findExpUserById',
    method: 'get',
    params
  })
}

// 查询实验主试
export const findUserExpByExpId = (params) => {
  return axios({
    url: '/funExp/findUserExpByExpId',
    method: 'get',
    params
  })
}

// 查询实验被试
export const findExpUserByExpIdAndUserName = (params) => {
  return axios({
    url: '/funExp/findExpUserByExpIdAndUserName',
    method: 'post',
    params
  })
}

// 查询实验被试集合
export const findExpUsersPage = (data) => {
  return axios({
    url: '/funExp/findExpUsersPage',
    method: 'post',
    data
  })
}

// 查询被试实验集合
export const findSubjectPageByUserName = (data) => {
  return axios({
    url: '/funExp/findSubjectPageByUserName',
    method: 'post',
    data
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

// 根据实验状态查询
export const findPageByStatus = (data) => {
  return axios({
    url: '/funExp/findPageByStatus',
    method: 'post',
    data
  })
}
