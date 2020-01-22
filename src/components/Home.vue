<template>
  <div class="page">
    <h2>Home</h2>
    <el-button type="primary" @click="testAxios()">测试Axios调用</el-button>
    <el-button type="primary" @click="getUser()">获取用户信息</el-button>
    <el-button type="primary" @click="getMenu()">获取菜单信息</el-button>
  </div>
</template>

<script>
// axios 是一个基于 Promise 用于浏览器和 nodejs 的 HTTP 客户端，我们后续需要用来发送 http 请求。
import axios from 'axios'
// require('../mock/mock.js')
import mock from '@/mock/index.js';

export default {
  name: 'Home',
  methods: {
    testAxios: function () { // 点击测试按钮触发 http 请求，并弹出窗显示返回数据
      axios.get('http://localhost:8080')
        .then(function (res) {
          alert(res.data)
        }).catch(function (res) {
          alert(res)
        })
    },
    getUser: function () {
      axios.get('http://localhost:8080/user')
        .then(function (res) {
          alert(JSON.stringify(res.data))
        }).catch(function (res) {
          alert(res)
        })
    },
    getMenu: function () {
      axios.get('http://localhost:8080/menu')
        .then(function (res) {
          alert(JSON.stringify(res.data))
        }).catch(function (res) {
          alert(res)
        })
    }

  }
}
</script>

<style scoped>

</style>
