<template>
  <div
    class="playlistMenubar"
    :style="playlistMenubarStyle"
    v-clickOutside="closePlaylistMenubar"
    ref="playlistMenubar"
  >
    <div class="createNewPlaylist" @click="showCreatePlaylistMenubar">
      <div class="btn">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-jichu07"></use>
        </svg>
      </div>
      <div class="desc">新建歌单</div>
    </div>
    <div class="playlist" v-if="likedPlaylists.length > 0">
      <div
        class="item"
        v-for="playlist in likedPlaylists"
        :key="playlist.id"
        @click="addSongs(playlist.id)"
      >
        <div class="cover">
          <img :src="playlist.coverImgUrl" />
        </div>
        <div class="desc">
          <div class="name">{{ playlist.name }}</div>
          <div class="number">{{ playlist.trackCount }}首</div>
        </div>
      </div>
    </div>
    <create-playlist-menubar
      v-if="isShow"
      :menubarTop="menubarTop"
      :menubarLeft="menubarLeft + 255"
      @close="closeCreateMenubar"
    ></create-playlist-menubar>
  </div>
</template>

<script>
import CreatePlaylistMenubar from "./CreatePlaylistMenubar.vue";
import { messagebox } from "@/utils/customComponent";
import { addOrDeleteSongFromPlaylist } from "@/api/user";
import { useStore } from "vuex";
import { ref, toRefs, computed, getCurrentInstance } from "vue";
export default {
  name: "PlaylistMenubar",
  components: { CreatePlaylistMenubar },
  props: {
    menubarTop: {
      type: Number,
      default: 0,
    },
    menubarLeft: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    // 当前组件实例
    const comInstance = getCurrentInstance();
    // data
    const { menubarTop, menubarLeft } = toRefs(props);
    const playlistMenubar = ref(null);
    const isShow = ref(false);
    // vuex
    const store = useStore();
    const userId = computed(() => store.getters.getUserID);
    const playList = computed(() => store.getters.getPlayList);
    const likedPlaylists = computed(() =>
      store.getters.getLikedPlaylists.filter((p) => p.userId === userId.value)
    );

    // computed
    // playlistMenubar样式
    const playlistMenubarStyle = {
      top: menubarTop.value + "px",
      left: menubarLeft.value + "px",
    };

    // methods
    // 1.关闭歌单菜单栏
    const closePlaylistMenubar = () => {
      const playlistMenubarEl = playlistMenubar.value;
      //从DOM树中移除
      playlistMenubarEl.parentNode.remove();
      //卸载应用实例的根组件
      comInstance.appContext.app.unmount();
    };

    // 2.添加选中歌曲到歌单
    const addSongs = async (playlistId) => {
      closePlaylistMenubar();
      const playlistArr = playList.value;
      const idsArr = [];
      let ids = "";
      playlistArr.forEach((s) => {
        s.checked ? idsArr.push(s.id) : "";
      });
      ids = idsArr.join(",");
      if (ids !== "") {
        const res = await addOrDeleteSongFromPlaylist({
          op: "add",
          pid: playlistId,
          tracks: ids,
        });
        if (res.status === 200 && res.body.code === 502) {
          messagebox.warn(res.body.message);
          return;
        }
        if (res.status === 200 && res.body.code === 200) {
          messagebox.success("添加成功");
          //重新拉取用户歌单数据
          store.dispatch("setUserLikedMusicData", userId.value);
        } else {
          messagebox.warn("添加失败");
          console.log(res);
        }
      } else {
        messagebox.warn("请选择歌曲");
      }
    };

    // 3.显示createPlaylistMenubar
    const showCreatePlaylistMenubar = () => {
      isShow.value = true;
    };

    // 4.关闭createPlaylistMenubar
    const closeCreateMenubar = (flag) => {
      isShow.value = flag;
    };

    const createPlaylist = () => {};

    return {
      // data
      playlistMenubar,
      menubarTop,
      menubarLeft,
      isShow,
      // computed
      playlistMenubarStyle,
      // vuex
      likedPlaylists,
      // methods
      closePlaylistMenubar,
      addSongs,
      showCreatePlaylistMenubar,
      closeCreateMenubar,
    };
  },
};
</script>

<style lang='scss' scoped>
.playlistMenubar {
  position: fixed;
  //   top: 100px;
  //   left: 100px;
  z-index: 10000;
  padding: 5px;
  width: 250px;
  max-height: 500px;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  .createNewPlaylist {
    display: flex;
    position: absolute;
    top: 2px;
    left: 0;
    margin-bottom: 5px;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #eee;
    border-radius: 10px;
    &:hover {
      background-color: #eee;
    }
    .btn {
      position: relative;
      margin-right: 15px;
      width: 50px;
      height: 50px;
      svg {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto 15px;
      }
    }
    .desc {
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      font-weight: 700;
    }
  }
  .playlist {
    margin-top: 50px;
    height: 440px;
    overflow: auto;
    .item:last-child {
      margin-bottom: 0;
    }
    .item {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      padding-left: 5px;
      height: 58px;
      border-radius: 5px;
      &:hover {
        background-color: #eee;
      }
      .cover {
        margin-right: 15px;
        width: 50px;
        height: 50px;
        border-radius: 5px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .desc {
        flex-grow: 1;
        .name {
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
  }
}
</style>