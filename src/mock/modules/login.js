// login.js：登录相关的接口模拟

// 登录接口
export function login () {
  return {
    // isOpen: false,
    url: 'http://localhost:8080/login',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'data': {
        'token': '4344323121398'
        // 其他数据
      }
    }
  }
}
