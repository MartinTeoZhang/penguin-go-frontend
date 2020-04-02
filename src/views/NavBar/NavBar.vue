<!-- 导航菜单栏 -->
<template>
  <!-- 导航宽度样式 -->
  <div class="menu-bar-container">
    <!-- logo -->
    <div class="logo" :style="{'background-color':themeColor}" :class="collapse?'menu-bar-collapse-width':'menu-bar-width'"
         @click="$router.push('/')">
      <img src="@/assets/logo.png" /> <div>{{collapse?'':appName}}</div>
    </div>
    <!-- 导航菜单，菜单收缩状态绑定 -->
    <el-menu default-active="1" :class="collapse?'menu-bar-collapse-width':'menu-bar-width'"
             :collapse="collapse" @open="handleopen" @close="handleclose" @select="handleselect">
      <!-- 导航菜单树组件，动态加载菜单。页面通过封装的组件，读取 store 数据 递归生成菜单 -->
      <menu-tree v-for="item in navTree" :key="item.id" :menu="item"></menu-tree>
    </el-menu>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import MenuTree from '@/components/MenuTree'

  export default {
    components: {
      MenuTree
    },

    methods: {
      handleopen () {
        console.log('handleopen');
      },
      handleclose () {
        console.log('handleclose');
      },
      handleselect (a, b) {
        console.log('handleselect');
      }
    },

    computed: {
      ...mapState({
        appName: state=>state.app.appName,
        themeColor: state=>state.app.themeColor,
        collapse: state=>state.app.collapse,
        navTree: state=>state.menu.navTree
      })
    },

  };
</script>

<style scoped lang="scss">
  .menu-bar-container {
    .el-menu {
      position:absolute;
      top: 60px;
      bottom: 0px;
      text-align: left;
      // background-color: #2968a30c;
      cursor:pointer;
    }
    .logo {
      position:absolute;
      top: 0px;
      height: 60px;
      line-height: 60px;
      background: #409EFF;
      img {
        width: 40px;
        height: 40px;
        border-radius: 0px;
        margin: 10px 10px 10px 10px;
        float: left;
      }
      div {
        font-size: 22px;
        color: white;
        text-align: left;
      }
    }
    .menu-bar-width {
      width: 200px;
    }
    .menu-bar-collapse-width {
      width: 60px;
    }
  }
</style>
