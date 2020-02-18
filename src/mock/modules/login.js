// login.js：登录相关的接口模拟

// 登录接口
const loginData = {
  "code": 200,
  "msg": null,
  "data": {
    "id": null,
    "userId": 1,
    "token": "77ae89be36504adfb5c09ef71409ea0e",
    "expireTime": "2020-02-18T15:24:50.473+0000",
    "createBy": null,
    "createTime": null,
    "lastUpdateBy": null,
    "lastUpdateTime": "2020-02-20T04:24:50.473+0000"
  }
}

export function login () {
  return {
    url: 'login',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0,
      'data': loginData
    }
  }
}

// 登出接口
const logoutData = {
  "code": 200,
  "msg": null,
  "data": {
  }
}

export function logout() {
  return {
    url: 'logout',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0,
      'data': logoutData
    }
  }
}
