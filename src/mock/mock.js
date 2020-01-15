import Mock from 'mockjs' // es6语法引入mock模块

// 引入 Mock.js，模拟后台接口提供页面需要的数据，
// 为我们提供模拟数据，而不用依赖于后台接口的完成。

// 模拟了两个接口，分别拦截用户和菜单的请求，并返回相应的数据。
Mock.mock('http://localhost:8080/user', { // 拦截用户请求
  'name': '@name', // 随机生成姓名
  'email': '@email', // 随机生成邮箱
  'age | 1-10': 5
  // 其他数据
})

Mock.mock('http://localhost:8080/menu', { // 拦截菜单请求
  'id': '@increment',
  'name': 'menu',
  'age | 10-20': 12
  // 其他数据
})
