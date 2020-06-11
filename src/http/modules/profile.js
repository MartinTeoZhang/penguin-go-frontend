//加载user的个人信息
import axios from '../axios'

//获取用户基本信息
export const getBasicInfo = (params) => {
  return axios({
    url: '/user/getInfoByName',
    method: 'get',
    params
  })
};

//更改密码
export const updatePwd = (params) => {
  return axios({
    url: '/user/updatePwd',
    method: 'post',
    params
  })
};


//加载实验统计基本数据
export const getExpStatData = (params) => {
  return axios({
    url: '/funExp/getExpStatData',
    method: 'get',
    params
  })
};


// 分页查询
export const findPage = (data) => {
  return axios({
    url: '/funExp/findPage',
    method: 'post',
    data
  })
}
