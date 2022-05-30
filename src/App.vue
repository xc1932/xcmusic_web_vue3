<template>
  <div class="app">
    <!-- 顶部导航栏组件 -->
    <Header></Header>
    <!-- 登录组件 -->
    <login v-if="getShowLoginBox"></login>
    <!-- 带缓存的页面视图 -->
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <!-- 无缓存的页面视图 -->
    <router-view name="noCache" :key="$route.fullPath"></router-view>
    <!-- <home-view></home-view> -->
    <!-- 播放器 -->
    <player />
  </div>
</template>

<script>
import useGetUserLikedMusicData from "./views/hooks/useGetUserLikedMusicData";
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
  created() {
    useGetUserLikedMusicData();
  },
};
</script>

<style lang="scss">
#app {
  height: 0;
}
.app {
  display: flow-root;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
}
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
