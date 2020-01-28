// login.js：登录相关的接口模拟

// 登录接口
// 把请求类型改为 post。
export function login () {
  return {
    // isOpen: false,
    url: 'http://localhost:8080/login',
    type: 'post',
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
