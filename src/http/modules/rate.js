/*
 * 评分模块
 */

import axios from '../axios'

// 保存
export const save = (data) => {
  return axios({
    url: '/funRate/save',
    method: 'post',
    data
  })
}

// 根据实验ID和被评价者ID查找记录
export const findRateByExpIdAndRatedId = (params) => {
  return axios({
    url: '/funRate/findRateByExpIdAndRatedId',
    method: 'get',
    params
  })
}

// 根据被评价者ID查找所有记录
export const findAllRateByRatedId = (params) => {
  return axios({
    url: '/funRate/findAllRateByRatedId',
    method: 'get',
    params
  })
}
