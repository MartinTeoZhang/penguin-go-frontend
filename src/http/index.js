/*
  封装 axios 模块
  封装背景
  使用axios发起一个请求是比较简单的事情，但是axios没有进行封装复用，
  项目越来越大，会引起越来越多的代码冗余，让代码变得越来越难维护。
  所以我们在这里先对 axios 进行二次封装，使项目中各个组件能够复用请求，让代码变得更容易维护。

  封装要点
  统一 url 配置
  统一 api 请求
  request (请求) 拦截器，例如：带上token等，设置请求头
  response (响应) 拦截器，例如：统一错误处理，页面重定向等
  根据需要，结合 Vuex 做全局的 loading 动画，或者错误处理
  将 axios 封装成 Vue 插件使用
 */

// index.js：将 axios 封装成插件，按插件方式引入。
// 导入所有接口
import apis from './interface'

const install = Vue => {
  if (install.installed)
      return

  install.installed = true

  Object.defineProperties(Vue.prototype, {
    // 注意，此处挂载在 Vue 原型的 $api 对象上
    $api: {
      get () {
        return apis
      }
    }
  })
}

export default install
