<template>
  <div class="page">
    <h2>登录页</h2>
    <!-- 调用 login 接口返回数据。-->
    <el-button type="primary" @click="login()">登录</el-button>
  </div>
</template>

<script>
  import mock from '@/mock/index.js';
  import Cookies from "js-cookie";
  import router from '@/router'

  export default {
    name: 'Login',
    methods: {
      login() {
        // 在vue中使用axios做网络请求的时候，会遇到this不指向vue，而为undefined。
        // 使用箭头函数替代普通函数，ES6中的箭头函数 “=>” 内部的 this 属于词法作用域，
        // 由上下文确定（也就是由外层调用者vue来确定）。
        this.$api.login().then((res) => {
          console.log(res)
          alert(res.data.token)
          Cookies.set('token', res.data.token) // 放置token到Cookie
          router.push('/')  // 登录成功，跳转到主页
        }).catch(function(res) {
          alert(res);
        });

      }
    }
  }
</script>

<style scoped>

</style>
