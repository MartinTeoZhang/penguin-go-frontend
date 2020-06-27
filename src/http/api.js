/*
 * 接口统一集成模块
 */
import * as login from './modules/login'
import * as user from './modules/user'
import * as dept from './modules/dept'
import * as role from './modules/role'
import * as menu from './modules/menu'
import * as dict from './modules/dict'
import * as log from './modules/log'
import * as exp from './modules/exp'
import * as profile from './modules/profile'
import * as rate from './modules/rate'

// 默认全部导出
export default {
  login,
  user,
  dept,
  role,
  menu,
  dict,
  log,
  exp,
  profile,
  rate
}
