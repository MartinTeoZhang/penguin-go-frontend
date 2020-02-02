/*
 * 菜单管理模块
 */

import axios from '../axios'

// 查询导航菜单树的接口
export const findMenuTree = () => {
  return axios({
    url: '/menu/findTree',
    method: 'get'
  })
}
