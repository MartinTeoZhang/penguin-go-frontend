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

//头像上传
export const uploadAvatar = (data) => {
  return axios({
    url: '/sysAvatar/upload',
    method: 'post',
    headers:{
      'Content-Type': 'multipart/form-data'
    },
    data
  })
};

//根据userId查询头像
export const getAvatarByUserId = (params) => {
  return axios({
    url: '/sysAvatar/getAvatarByUserId',
    method: 'get',
    params
  })
};

//根据用户名查询头像
export const getAvatarByUserName = (params) =>{
  return axios({
    url: '/sysAvatar/getAvatarByUserName',
    method: 'get',
    params
  })
};
