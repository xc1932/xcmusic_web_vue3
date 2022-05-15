<template>
  <div class="app">
    <!-- 顶部导航栏组件 -->
    <Header></Header>
    <!-- 登录组件 -->
    <login v-if="getShowLoginBox"></login>
    <!-- 页面 -->
    <home-view></home-view>
    <!-- 播放器 -->
    <player />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Player from "@/components/player/Player.vue";
import Header from "@/components/header/Header.vue";
import Login from "@/components/login/Login";
import HomeView from "./views/HomeView.vue";
export default {
  name: "App",
  components: { HomeView, Login, Header, Player },
  computed: {
    ...mapGetters(["getShowLoginBox"]),
  },
};
</script>

<style lang="scss">
#nprogress {
  .bar {
    z-index: 9999;
    background: red !important; //自定义颜色
  }
  .spinner {
    z-index: 9999;
  }
}
</style>
