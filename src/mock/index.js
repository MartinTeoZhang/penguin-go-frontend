// 封装 mock 模块
// 为了统一可以统一管理和集中控制数据模拟接口，
// 我们对 mock 模块进行了封装，可以方便的定制模拟接口的统一开关和个体开关。

import Mock from 'mockjs'
import * as global from '@/utils/global'
import * as login from './modules/login'
import * as user from './modules/user'
import * as role from './modules/role'
import * as dept from './modules/dept'
import * as menu from './modules/menu'
import * as dict from './modules/dict'
import * as log from './modules/log'

let baseUrl = global.baseURL
// 1. 开启/关闭[所有模块]拦截, 通过调[openMock参数]设置.
// 2. 开启/关闭[业务模块]拦截, 通过调用fnCreate方法[isOpen参数]设置.
// 3. 开启/关闭[业务模块中某个请求]拦截, 通过函数返回对象中的[isOpen属性]设置.
let openMock = true
// let openMock = false

fnCreate(login, openMock)
fnCreate(user, openMock)
fnCreate(role, openMock)
fnCreate(dept, openMock)
fnCreate(menu, openMock)
fnCreate(dict, openMock)
fnCreate(log, openMock)

// index.js：模拟接口模块聚合文件
/**
 * 创建mock模拟数据
 * @param {*} mod 模块
 * @param {*} isOpen 是否开启?
 */
function fnCreate (mod, isOpen = true) {
  if (isOpen) {
    for (var key in mod) {
      ((res) => {
        if (res.isOpen !== false) {
          let url = baseUrl + res.url
          Mock.mock(new RegExp(url), res.type, (opts) => { // openMock == false
          // Mock.mock(new RegExp(baseUrl), res.type, (opts) => { // openMock == true
            opts['data'] = opts.body ? JSON.parse(opts.body) : null
            delete opts.body
            console.log('\n')
            console.log('%cmock拦截, 请求: ', 'color:yellow', opts)
            console.log('%cmock拦截, 响应: ', 'color:yellow', res.data)
            return res.data
          })
        }
      })(mod[key]() || {})
    }
  }
}
