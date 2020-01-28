// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import api from './http/index' // 在 main.js 中以 vue 插件的形式引入 axios，
// 这样在其他地方就可通过 this.$api 调用相关的接口了。
import i18n from './i18n'
import '@/theme/theme-409EFF//index.css'

Vue.use(ElementUI) // 导入所有Element-UI组件
Vue.use(api) // 导入 axios 插件
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  components: { App },
  template: '<App/>'
})
