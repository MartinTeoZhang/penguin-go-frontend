<!-- 主内容区域 -->
<template>
  <div class="container" :class="$store.state.app.collapse?'menu-bar-collapse-width':'menu-bar-width'">
    <bread-crumb></bread-crumb>
    <transition name="fade" mode="out-in">
      <router-view class="content"></router-view>
    </transition>
  </div>
</template>

<script>
  import BreadCrumb from "@/components/BreadCrumb"
  export default {
    components: {
      BreadCrumb
    }
  };
</script>

<style scoped lang="scss">
  .container {
    position: absolute;
    top: 60px;
    right: 0px;
    border-color: rgba(148, 145, 147, 0.2);
    border-left-width: 1px;
    border-left-style: solid;
    // background: rgba(211, 71, 113, 0.1);
    .breadcrumb {
      padding: 10px;
      border-color: rgba(38, 86, 114, 0.2);
      border-bottom-width: 1px;
      border-bottom-style: solid;
      background: rgba(138, 158, 170, 0.2);
    }
    .content {
      margin-top: -25px;
      margin-bottom: 5px;
      padding-top: 5px;
      // background: rgba(86, 37, 126, 0.1);
    }
  }
  .menu-bar-width {
    left: 200px;
  }
  .menu-bar-collapse-width {
    left: 60px;
  }
</style>
