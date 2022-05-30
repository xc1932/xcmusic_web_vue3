<template>
  <div class="myMusicView" ref="myMusicViewRef">
    <div class="container center">
      <create-playlist-menubar
        :style="createBarStyle"
        v-show="createBarShow"
        @close="closeMenubar"
      ></create-playlist-menubar>
      <div class="header">
        <div class="avatar">
          <img :src="userAvatar" />
        </div>
        <div class="username">{{ userName }}的音乐</div>
      </div>
      <div class="likedSongs" v-if="likedSongsWithDetail.length > 0">
        <div class="left">
          <img :src="firstLikedSongWithDetail.detail?.songInfo.al.picUrl" />
          <div class="btn">
            <play-btn @click="playAllLikedSongs"></play-btn>
          </div>
        </div>
        <div class="right">
          <div
            class="item"
            v-clickZoomOut
            v-for="song in likedSongsWithDetail"
            :key="song.id"
            :class="{ unplayable: !song.playable.playable }"
            @click="playOneSong(song)"
          >
            <div class="cover">
              <img :src="song.detail.songInfo.al.picUrl" />
            </div>
            <div class="desc">
              <div class="songname textoverflow-hidden-single">
                {{ song.detail.songInfo.name }}
              </div>
              <div class="singer textoverflow-hidden-single">
                {{ song.detail.songInfo.ar[0].name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mycollect" ref="mycollectRef">
        <div class="navbar" @click="scrollTop">
          <div class="left">
            <div
              class="category playlist"
              :class="{ active: currentTab === 0 }"
              v-clickZoomOut
              @click="currentTab = 0"
            >
              歌单
            </div>
            <div
              class="category album"
              :class="{ active: currentTab === 1 }"
              v-clickZoomOut
              @click="currentTab = 1"
            >
              专辑
            </div>
            <div
              class="category artist"
              :class="{ active: currentTab === 2 }"
              v-clickZoomOut
              @click="currentTab = 2"
            >
              艺人
            </div>
            <div
              class="category mv"
              :class="{ active: currentTab === 3 }"
              v-clickZoomOut
              @click="currentTab = 3"
            >
              MV
            </div>
            <div
              class="category cloud"
              :class="{ active: currentTab === 4 }"
              v-clickZoomOut
              @click="currentTab = 4"
            >
              云盘
            </div>
          </div>
          <div
            class="right"
            v-clickZoomOut
            v-show="currentTab === 0"
            @click="createPlaylist"
          >
            <plus-outlined />
            新建歌单
          </div>
        </div>
        <div class="collectbody">
          <div
            class="playlistbody"
            v-show="currentTab === 0"
            v-if="likedPlaylist.length > 0"
          >
            <rectangle-show-box
              v-for="playlist in likedPlaylist"
              :key="playlist.id"
              imgHeight="225px"
              boxWidth="225px"
              boxHeight="300px"
              imgRadius="15px"
              :trackCount="playlist.trackCount"
              :imgUrl="playlist.coverImgUrl"
              @playbtnClick="playAllPlaylistSongs(playlist)"
            >
              <div class="top textoverflow-hidden-single">
                {{ playlist.name }}
              </div>
              <div class="bottom textoverflow-hidden-single">
                {{ playlist.creator.nickname }}
                <span class="delete" @click.stop="deleteMyplaylist(playlist.id)"
                  >删除</span
                >
              </div>
            </rectangle-show-box>
          </div>
          <div
            class="albumbody"
            v-show="currentTab === 1"
            v-if="likedAlbums.length > 0"
          >
            <rectangle-show-box
              v-for="album in likedAlbums"
              :key="album.id"
              imgHeight="225px"
              boxWidth="225px"
              boxHeight="300px"
              imgRadius="15px"
              :imgUrl="album.picUrl"
              @playbtnClick="playAllSongInAlbum(album)"
            >
              <div class="top textoverflow-hidden-single">
                {{ album.name }}
              </div>
              <div class="bottom textoverflow-hidden-single">
                {{ album.artists[0].name }}
                <span class="delete" @click.stop="deleteMyAlbum(album.id)"
                  >删除</span
                >
              </div>
            </rectangle-show-box>
          </div>
          <div
            class="artistbody"
            v-show="currentTab === 2"
            v-if="likedArtists.length > 0"
          >
            <rectangle-show-box
              v-for="artist in likedArtists"
              :key="artist.id"
              imgHeight="225px"
              boxWidth="225px"
              boxHeight="300px"
              imgRadius="50%"
              :imgUrl="artist.picUrl"
              @playbtnClick="playAllSongOfArtist(artist.id)"
            >
              <div class="top textoverflow-hidden-single">
                {{ artist.name }}
              </div>
            </rectangle-show-box>
          </div>
          <div
            class="mvbody"
            v-show="currentTab === 3"
            v-if="likedMVs.length > 0"
          >
            <rectangle-show-box
              v-for="mv in likedMVs"
              :key="mv.vid"
              imgHeight="160px"
              boxWidth="285px"
              boxHeight="230px"
              imgRadius="15px"
              :imgUrl="mv.coverUrl"
              @playbtnClick="playMV(mv.vid)"
            >
              <div class="top textoverflow-hidden-single">
                {{ mv.title }}
              </div>
              <div class="bottom textoverflow-hidden-single">
                {{ mv.creator[0].userName }}
                <span class="delete" @click.stop="deleteMyMV(mv.vid)"
                  >删除</span
                >
              </div>
            </rectangle-show-box>
          </div>
          <div
            class="cloudbody"
            v-show="currentTab === 4"
            v-if="likedCloudDisk.length > 0"
          >
            <div
              class="songItem"
              v-for="clouddisk in likedCloudDisk"
              :key="clouddisk.songId"
              v-clickZoomOut
            >
              <div class="left">
                <img :src="clouddisk.simpleSong.al.picUrl" />
                <div class="desc">
                  <div class="top">{{ clouddisk.songName }}</div>
                  <div class="bottom">{{ clouddisk.artist }}</div>
                </div>
              </div>
              <div class="right">
                {{ timeTransform(clouddisk.simpleSong.dt) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CreatePlaylistMenubar from "@/components/base/CreatePlaylistMenubar.vue";
import RectangleShowBox from "@/components/base/RectangleShowBox";
import { PlusOutlined } from "@ant-design/icons-vue";
import PlayBtn from "@/components/base/PlayBtn.vue";
import { messagebox } from "@/utils/customComponent";
import { timeTransform } from "@/utils/utils";
import { deletePlaylist } from "@/api/user";
import useMyMusicViewControls from "./hooks/useMyMusicViewControls";
import { useStore } from "vuex";
import { ref, computed, watch } from "vue";
export default {
  name: "MyMusicView",
  components: {
    PlayBtn,
    PlusOutlined,
    RectangleShowBox,
    CreatePlaylistMenubar,
  },
  setup(props) {
    // data
    const myMusicViewRef = ref(null);
    const mycollectRef = ref(null);
    const currentTab = ref(0);
    const createBarShow = ref(false);
    const createBarStyle = {
      top: "0",
      left: "0",
      bottom: "0",
      right: "0",
      margin: "auto",
    };
    // vuex
    const store = useStore();
    const userId = computed(() => store.getters.getUserID);
    const userAvatar = computed(() => store.getters.getUserAvatarUrl);
    const userName = computed(() => store.getters.getUserNickname);
    const firstLikedSongWithDetail = computed(() => {
      const likedSongsWithDetail = store.getters.getLikedSongsWithDetail;
      return likedSongsWithDetail.length > 0 ? likedSongsWithDetail[0] : {};
    });
    const likedSongsWithDetail = computed(() =>
      store.getters.getLikedSongsWithDetail.slice(1, 13)
    );
    const likedSongs = computed(() => store.getters.getLikedSongs);
    const likedPlaylist = computed(() =>
      store.getters.getLikedPlaylists.slice(1)
    );

    // watch
    watch(
      userId,
      (newId) => {
        if (newId == null) return;
        store.dispatch("setLikedSongsWidthDetail", newId);
      },
      { immediate: true }
    );

    // methods
    // 1.播放所有喜欢的音乐
    const playAllLikedSongs = () => {
      store.dispatch("setPlayerPlayList", likedSongs.value);
    };
    // 2.播放一首
    const playOneSong = (song) => {
      if (!song.playable.playable) return;
      store.dispatch("setPlayerPlayList", [song.id]);
    };
    // 3.点击navbar向上滚动
    const scrollTop = () => {
      // myMusicViewRef.value.scrollTo({
      //   top: 350,
      //   behavior: "smooth",
      // });
      mycollectRef.value.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };
    // 4.播放列表中的歌曲
    const playAllPlaylistSongs = (playlist) => {
      if (playlist.trackCount <= 0) {
        messagebox.warn("没有歌曲");
        return;
      }
      store.dispatch("getPlaylistSongsAndPlay", playlist.id);
    };
    // 5.创建歌单
    const createPlaylist = () => {
      createBarShow.value = true;
    };

    // 6.关闭创建歌单菜单
    const closeMenubar = () => {
      createBarShow.value = false;
    };

    // 7.删除歌单
    const deleteMyplaylist = async (id) => {
      const res = await deletePlaylist({ id });
      if (res.code === 200) {
        messagebox.success("删除成功");
        // 重新拉取歌单收藏列表
        store.dispatch("setLikedPlayLists", userId.value);
      }
    };

    const {
      likedAlbums,
      likedArtists,
      likedMVs,
      likedCloudDisk,
      playAllSongInAlbum,
      deleteMyAlbum,
      playAllSongOfArtist,
      playMV,
      deleteMyMV,
    } = useMyMusicViewControls();

    return {
      // data
      myMusicViewRef,
      mycollectRef,
      currentTab,
      createBarShow,
      createBarStyle,
      // vuex
      userAvatar,
      userName,
      firstLikedSongWithDetail,
      likedSongsWithDetail,
      likedPlaylist,
      likedAlbums,
      likedArtists,
      likedMVs,
      likedCloudDisk,
      // methods
      playAllLikedSongs,
      playAllPlaylistSongs,
      playAllSongInAlbum,
      playAllSongOfArtist,
      playMV,
      playOneSong,
      scrollTop,
      timeTransform,
      createPlaylist,
      closeMenubar,
      deleteMyplaylist,
      deleteMyAlbum,
      deleteMyMV,
    };
  },
};
</script>

<style lang='scss' scoped>
.myMusicView {
  margin: 75px auto 0;
  padding-bottom: 90px;
  height: calc(100% - 100px);
  overflow: auto;
  .header {
    display: flex;
    align-items: center;
    margin-top: 20px;
    height: 70px;
    .avatar {
      margin-right: 10px;
      height: 50px;
      width: 50px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .username {
      font-size: 40px;
      font-weight: 700;
    }
  }
  .likedSongs {
    display: flex;
    margin-bottom: 50px;
    .left {
      flex-shrink: 0;
      position: relative;
      width: 400px;
      height: 230px;
      border-radius: 15px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        transition: transform 0.75s ease;
        &:hover {
          transform: scale(1.1);
        }
      }
      .btn {
        position: absolute;
        bottom: 10px;
        right: 15px;
      }
    }
    .right {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      .item.unplayable {
        opacity: 0.5;
        &:hover {
          background-color: #fff;
        }
      }
      .item {
        display: flex;
        align-items: center;
        padding: 0 10px;
        width: 260px;
        height: 50px;
        border-radius: 5px;
        cursor: pointer;
        &:hover {
          background-color: #eee;
        }
        .cover {
          flex-shrink: 0;
          margin-right: 10px;
          width: 40px;
          height: 40px;
          border-radius: 5px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .desc {
          width: 190px;
          .songname {
            font-size: 18px;
            font-weight: 700;
          }
          .singer {
            font-size: 10px;
          }
        }
      }
    }
  }
  .mycollect {
    .navbar {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      @include not-allowed-select;
      .left {
        display: flex;
        .active {
          background-color: #eee;
        }
        .category {
          margin-right: 25px;
          padding: 5px 20px;
          border-radius: 10px;
          font-size: 22px;
          font-weight: 700;
          cursor: pointer;
          &:hover {
            background-color: #eee;
          }
        }
      }
      .right {
        padding: 5px 20px;
        border-radius: 10px;
        font-size: 22px;
        font-weight: 700;
        cursor: pointer;
        &:hover {
          background-color: #eee;
        }
      }
    }
    .collectbody {
      .playlistbody,
      .albumbody,
      .artistbody {
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        .rectangleshowbox {
          margin-right: 15px;
          .top {
            font-size: 20px;
            font-weight: 700;
          }
          .bottom {
            font-size: 12px;
          }
        }
      }
      .playlistbody,
      .albumbody,
      .mvbody {
        .delete {
          float: right;
          cursor: pointer;
        }
      }
      .artistbody {
        .top {
          text-align: center;
        }
      }
      .mvbody {
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        .rectangleshowbox {
          margin-right: 15px;
          .top {
            font-size: 20px;
            font-weight: 700;
          }
          .bottom {
            font-size: 12px;
          }
        }
      }
      .cloudbody {
        .songItem {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 10px;
          border-radius: 10px;
          cursor: pointer;
          @include not-allowed-select;
          &:hover {
            background-color: #eee;
          }
          .left {
            display: flex;
            img {
              margin-right: 10px;
              width: 50px;
              height: 50px;
              border-radius: 5px;
            }
            .desc {
              .top {
                font-size: 18px;
                font-weight: 700;
              }
              .bottom {
                font-size: 12px;
              }
            }
          }
          .right {
            width: 100px;
            text-align: center;
            font-size: 18px;
            font-weight: 700;
          }
        }
      }
    }
  }
}
</style>