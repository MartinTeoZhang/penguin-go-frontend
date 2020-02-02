import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex);

import app from './modules/Application.js';
import menu from './modules/Menu.js';

// 引入模块化，这里把之前的状态抽取到application

const store = new vuex.Store({
  modules: {
    app: app,
    menu: menu
    // 其他
  }
})

export default store
