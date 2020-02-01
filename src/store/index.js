import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex);

import AppStore from './modules/AppStore.js';
// 引入模块化，这里把之前的状态抽取到AppStore

const store = new vuex.Store({
  modules: {
    app: AppStore
    // 其他
  }
})

export default store
