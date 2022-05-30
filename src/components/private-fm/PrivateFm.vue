<template>
  <div
    class="privatefm"
    v-if="fmSongs.length > 0"
    @click.stop="toAlbumView(fmSongs[0].albumId)"
  >
    <div class="left">
      <img :src="fmSongs[0].coverImage" />
    </div>
    <div class="right">
      <div class="top">
        <div class="songName textoverflow-hidden-single">
          {{ fmSongs[0].songName }}
        </div>
        <div
          class="singerName textoverflow-hidden-single"
          v-if="fmSongs[0].artists.length > 0"
        >
          <span @click.stop="toArtistView(fmSongs[0].artists[0].artistId)">{{
            fmSongs[0].artists[0].artistName
          }}</span>
          <span
            v-for="artist in fmSongs[0].artists.slice(1)"
            :key="artist.id"
            @click.stop="toArtistView(artist.artistId)"
            >{{ " / " + artist.artistName }}</span
          >
        </div>
      </div>
      <div class="bottom">
        <div class="btns">
          <div class="trash" v-clickZoomOut @click.stop="unlikeSongOfFM">
            <img src="@/assets/svg/unlike.svg" />
          </div>
          <div class="play" v-clickZoomOut>
            <img
              src="@/assets/svg/pause.svg"
              @click.stop="pauseSongOfFM"
              v-if="isPlaying"
            />

            <img
              src="@/assets/svg/whiteplay.svg"
              @click.stop="playSongOfFM"
              v-else
            />
          </div>
          <div class="next" v-clickZoomOut @click.stop="playNextSong">
            <img src="@/assets/svg/next.svg" />
          </div>
        </div>
        <div class="logo">
          <div class="fmIcon">
            <img src="@/assets/svg/fm.svg" />
          </div>
          私人FM
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserPrivateFM, deleteSongFromUserPrivateFM } from "@/api/user";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, computed, watch } from "vue";
export default {
  name: "PrivateFM",
  setup() {
    // vue-router
    const router = useRouter();
    // vuex
    const store = useStore();
    const curSongId = computed(() => store.getters.getCurSong.id);
    const playState = computed(() => store.getters.getPlaying);
    // data
    const fmSongs = ref([]);
    const isPlaying = ref(false);

    // watch
    watch(playState, (newVal) => {
      isPlaying.value = newVal;
    });

    // methods
    const initData = () => {
      getUserPrivateFM().then((res) => {
        if (res.code === 200) {
          fmSongs.value = res.data.map((s) => {
            return {
              id: s.id,
              artists: s.artists.map((a) => {
                return {
                  artistId: a.id,
                  artistName: a.name,
                };
              }),
              songName: s.name,
              coverImage: s.album.picUrl,
              albumId: s.album.id,
            };
          });
        }
      });
    };
    // 1.页面跳转方法
    const toAlbumView = (albumId) => {
      router.push(`/album/${albumId}`);
    };
    const toArtistView = (artistId) => {
      router.push(`/artist/${artistId}`);
    };
    // 2.播放控制方法
    // 播放(和播放器联动)
    const playSongOfFM = () => {
      isPlaying.value = true;
      if (fmSongs.value.length > 0 && curSongId.value !== fmSongs.value[0].id) {
        store.dispatch("setPlayerPlayList", [fmSongs.value[0].id]);
      }
      store.dispatch("setPlayerPlaying", true);
    };
    // 暂停播放(和播放器联动)
    const pauseSongOfFM = () => {
      isPlaying.value = false;
      store.dispatch("setPlayerPlaying", false);
    };
    // 播放下一首
    const playNextSong = () => {
      getUserPrivateFM().then((res) => {
        if (res.code === 200) {
          fmSongs.value = res.data.map((s) => {
            return {
              id: s.id,
              artists: s.artists.map((a) => {
                return {
                  artistId: a.id,
                  artistName: a.name,
                };
              }),
              songName: s.name,
              coverImage: s.album.picUrl,
              albumId: s.album.id,
            };
          });
          playSongOfFM();
        }
      });
    };
    // 从FM中移除音乐
    const unlikeSongOfFM = () => {
      deleteSongFromUserPrivateFM({ id: fmSongs.value[0].id }).then((res) => {
        if (res.code === 200) {
          playNextSong();
        }
      });
    };

    // init data
    // 获取私人FM
    initData();
    return {
      // data
      fmSongs,
      isPlaying,
      // methods
      toAlbumView,
      toArtistView,
      playSongOfFM,
      pauseSongOfFM,
      playNextSong,
      unlikeSongOfFM,
    };
  },
};
</script>

<style lang='scss' scoped>
.privatefm {
  background: linear-gradient(#e66465, #9198e5);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  width: 590px;
  height: 200px;
  border-radius: $border-radius-rectangle;
  box-shadow: -4px 4px 15px 2px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  .left {
    margin: 0 20px;
    width: 170px;
    height: 170px;
    border-radius: $border-radius-rectangle;
    overflow: hidden;
    cursor: pointer;
    img {
      height: 100%;
      height: 100%;
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 400px;
    height: 170px;
    .top {
      .songName {
        height: 40px;
        line-height: 40px;
        font-size: 28px;
        font-weight: 700;
      }
      .singerName {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        font-weight: 500;
        span {
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      .btns {
        display: flex;
        align-items: center;
        .trash,
        .play,
        .next,
        .fmIcon {
          width: 30px;
          height: 30px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .play {
          margin: 0 6px;
          width: 40px;
          height: 40px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .logo {
        display: flex;
        align-items: center;
        margin-right: 20px;
        font-size: 18px;
        font-weight: 900;
        opacity: 0.2;
        .fmIcon {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 5px;
          width: 30px;
          height: 30px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>