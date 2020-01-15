import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'
import NotFound from '@/components/404'

Vue.use(Router)

export default new Router({
  routes: [
    { // 添加首页路由
      path: '/',
      name: 'Home',
      component: Home
    },
    { // 添加登录页路由
      path: '/login',
      name: 'Login',
      component: Login
    },
    { // 添加404页路由
      path: '/404',
      name: 'notFound',
      component: NotFound
    },
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]

})
