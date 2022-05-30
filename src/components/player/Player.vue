<template>
  <teleport to="body">
    <div
      class="playFullScreen"
      ref="playFullScreenRef"
      :style="{ height }"
      @mouseleave.stop="mouseLeavePlayer"
      @mouseover="mouseOverPlayer"
    >
      <div class="background">
        <img :src="curSongDetail?.songInfo.al.picUrl" />
      </div>
      <div class="palyerMain" v-show="isFillScreen">
        <div class="foldBtn" @click="closeFullScreen">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jichu06"></use>
          </svg>
        </div>
        <div class="playerHeader">
          <div class="left">
            <img src="@/assets/images/music.png" />
            我的音乐
          </div>
          <div class="right"></div>
        </div>
        <div class="playerbody center">
          <div class="playerLeft">
            <player-song-list></player-song-list>
          </div>
          <div class="playerRight">
            <div class="songInfo">
              <div class="pic">
                <img
                  :src="curSongDetail?.songInfo.al.picUrl"
                  v-if="curSongDetail?.songInfo.al.picUrl"
                />
                <img src="@/assets/images/player_cover.png" v-else />
              </div>
              <div class="desc">
                <div class="songName">
                  歌曲名：{{ curSongDetail?.songInfo.name }}
                </div>
                <div class="singer">
                  歌手：{{ curSongDetail?.songInfo.ar[0].name }}
                </div>
                <div class="albumName textoverflow-hidden-single">
                  专辑：{{ curSongDetail?.songInfo.al.name }}
                </div>
              </div>
            </div>
            <lyric-scroller
              :widthProp="400"
              :heightProp="300"
              :startScrollLine="5"
              :translate="lyricTrans"
            ></lyric-scroller>
          </div>
        </div>
      </div>
      <div class="player">
        <div class="left">
          <div class="info">
            <div class="cover">
              <img
                :src="curSongDetail?.songInfo.al.picUrl"
                v-if="curSongDetail?.songInfo.al.picUrl"
              />
              <img src="@/assets/images/player_cover.png" v-else />
            </div>
            <div class="desc">
              <div class="songName textoverflow-hidden-single">
                {{ curSongDetail?.songInfo.name }}
              </div>
              <div class="singer textoverflow-hidden-single">
                {{ curSongDetail?.songInfo.ar.map((a) => a.name).join("/") }}
              </div>
            </div>
          </div>
        </div>
        <div class="center">
          <div class="playerController">
            <div class="btns">
              <div class="pre" @click.stop="pre" v-clickZoomOut>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-bofangqi-shangyishou"></use>
                </svg>
              </div>
              <div class="play" @click.stop="togglePlay" v-clickZoomOut>
                <svg class="icon" aria-hidden="true" v-if="!playing">
                  <use xlink:href="#icon-bofangqi-bofang"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-else>
                  <use xlink:href="#icon-bofangqi-zanting"></use>
                </svg>
              </div>
              <div class="next" @click.stop="next" v-clickZoomOut>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-bofangqi-xiayishou"></use>
                </svg>
              </div>
            </div>
            <div class="process">
              <song-process-controller
                :translate="lyricTrans"
                @songProcessChanged="getSongProcess"
              ></song-process-controller>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="mode" @click="playModeChange">
            <svg class="icon" aria-hidden="true" v-show="playMode === 0">
              <use xlink:href="#icon-xunhuanbofang"></use>
            </svg>
            <svg class="icon" aria-hidden="true" v-show="playMode === 1">
              <use xlink:href="#icon-danquxunhuan"></use>
            </svg>
            <svg class="icon" aria-hidden="true" v-show="playMode === 2">
              <use xlink:href="#icon-suijibofang"></use>
            </svg>
          </div>
          <div class="collect" @click="likeASong(curSongDetail?.songInfo.id)">
            <svg
              class="icon"
              aria-hidden="true"
              v-if="likedSongs.includes(curSongDetail?.songInfo.id)"
            >
              <use xlink:href="#icon-yizhuifan"></use>
            </svg>
            <svg class="icon" aria-hidden="true" v-else>
              <use xlink:href="#icon-zhuifanshu"></use>
            </svg>
          </div>
          <div
            class="download"
            @click="download(curSong.url, curSong?.detail.songInfo.name)"
          >
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiazai5"></use>
            </svg>
          </div>
          <div
            class="translate"
            @click="translateLyric"
            :style="{ opacity: lyricTrans ? 1 : 0.5 }"
          >
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-fanyi"></use>
            </svg>
          </div>
          <div class="volume">
            <volume-controller @volumeChanged="getVolume"></volume-controller>
          </div>
          <div class="fullScreen" @click="fullScreenSwitch" v-clickZoomOut>
            <svg class="icon" aria-hidden="true" v-if="isFillScreen">
              <use xlink:href="#icon-quanping4-xianxing"></use>
            </svg>
            <svg class="icon" aria-hidden="true" v-else>
              <use xlink:href="#icon-quanping3-xianxing"></use>
            </svg>
          </div>
          <div class="fixed" @click="fixedSwitch" v-clickZoomOut>
            <svg class="icon" aria-hidden="true" v-if="!fixed">
              <use xlink:href="#icon-ding-xianxing"></use>
            </svg>
            <svg class="icon" aria-hidden="true" v-else>
              <use xlink:href="#icon-ding-mianxing"></use>
            </svg>
          </div>
        </div>
        <audio
          ref="audioRef"
          @canplay="canplayHandler"
          @timeupdate="timeUpdateHandler"
          @pause="pasueHandler"
          @ended="endedHandler"
          @error="errorHandler"
        ></audio>
      </div>
    </div>
  </teleport>
</template>

<script>
import useLikeSong from "./hooks/useLikeSong";
import useLyricController from "./hooks/useLyricController";
import LyricScroller from "./LyricScroller.vue";
import PlayerSongList from "./PlayerSongList.vue";
import VolumeController from "./VolumeController.vue";
import SongProcessController from "./SongProcessController.vue";
import { getLyric, getSongUrl } from "@/api/song";
import { download } from "@/utils/utils";
import { message } from "ant-design-vue";
import { useStore } from "vuex";
import { ref, computed, watch, onMounted } from "vue";
export default {
  name: "Player",
  components: {
    SongProcessController,
    VolumeController,
    PlayerSongList,
    LyricScroller,
  },
  setup() {
    // data
    const playFullScreenRef = ref(null);
    const audioRef = ref(null);
    const fixed = ref(true); //播放器固定控制
    const timer = ref(null); //播放器等待下滑计时
    const islistInitLoad = ref(true);
    const height = ref("85px");
    const isFillScreen = ref(false);
    const songReady = ref(false);
    const lyricTrans = ref(false);

    // vuex && computed
    const store = useStore();
    // 当前歌曲的详情、url、歌词、播放状态、播放音乐索引、歌曲列表、
    const currentIndex = computed(() => store.getters.getCurrentIndex);
    const playList = computed(() => store.getters.getPlayList);
    const curSong = computed(() => store.getters.getCurSong);
    const curSongDetail = computed(() => curSong.value.detail);
    const playing = computed(() => store.getters.getPlaying);
    const playMode = computed(() => store.getters.getPlayMode);
    const likedSongs = computed(() => store.getters.getLikedSongs);

    // watch
    // 1.监听当前歌曲的变化，切换新歌曲地址
    watch(curSong, (newSong) => {
      // 不可播放歌曲,自动播放下一首,直到最后一首歌
      if (
        !newSong?.playable?.playable &&
        currentIndex.value < playList.value.length - 1
      ) {
        next();
        return;
      }
      const audioEl = audioRef.value;
      if (!newSong || !audioEl) return;
      // 每次播放歌曲变化,设置新的url并获取对应歌词
      const url = newSong.url;
      audioEl.src = url;
      // 清空上一首的歌词
      store.commit("SET_PLAYERLYRIC", {});
      // 获取新的歌词
      getLyric({ id: newSong.id }).then((res) => {
        if (res.code === 200) {
          // console.log(res);
          store.commit("SET_PLAYERLYRIC", {
            lyric: res.lrc?.lyric,
            tlyric: res.tlyric?.lyric,
          });
        }
      });
      // 网站初次渲染只设置url不播放,之后每次改变歌曲都会播放歌曲
      if (islistInitLoad.value) {
        islistInitLoad.value = false;
        return;
      }
      // 设置播放状态开始播放
      store.dispatch("setPlayerPlaying", true);
    });

    // 2.监听播放状态的变化，播放或暂停歌曲
    watch(playing, (newPlaying) => {
      if (!songReady.value) {
        return;
      }
      const audioEl = audioRef.value;
      if (newPlaying) {
        audioEl.play();
      } else {
        audioEl.pause();
      }
    });

    // 3.监听播放进度，设置audio播放进度(audio.currentTime)
    const getSongProcess = (newPlayProcess) => {
      const audioEl = audioRef.value;
      audioEl.currentTime =
        newPlayProcess * (curSong.value?.detail?.songInfo.dt / 1000);
    };

    // 4.监听音量变化,设置audio音量大小(audio.volume)
    const getVolume = (newVolume) => {
      const audioEl = audioRef.value;
      audioEl.volume = newVolume;
    };

    // lifecycle
    onMounted(() => {
      // 防止因扰民策略,浏览器初次加载报错,关闭播放
      store.dispatch("setPlayerPlaying", false);
      store.dispatch("setPlayerPlayProcess", 0);
    });

    // methods
    // 1.播放、暂停
    const togglePlay = function () {
      // 处理因网页刷新导致的audio.src丢失
      const audioEl = audioRef.value;
      const url = curSong.value.url;
      if (audioEl.src === "") {
        audioEl.src = url;
      }
      store.dispatch("setPlayerPlaying", !playing.value);
    };
    // 2.上一首
    const pre = function () {
      const list = playList.value;
      let index = currentIndex.value;
      if (list.length < 1) return;
      // 限制index为播放列表的索引范围
      index < 0
        ? (index = 0)
        : index >= list.length
        ? (index = list.length - 1)
        : undefined;
      // 移至上一首
      index--;
      // 第一首的上一首为最后一首
      index < 0 ? (index = list.length - 1) : undefined;
      store.dispatch("setPlayerCurrentIndex", index);
    };
    // 3.下一首
    const next = function () {
      const list = playList.value;
      let index = currentIndex.value;
      if (list.length < 1) return;
      // 限制index为播放列表的索引范围
      index < 0
        ? (index = 0)
        : index >= list.length
        ? (index = list.length - 1)
        : undefined;
      // 移至下一首
      index++;
      // 最后一首的下一首为第一首
      index > list.length - 1 ? (index = 0) : undefined;
      store.dispatch("setPlayerCurrentIndex", index);
    };

    // 4.audio已经加载部分可以播放，但有可能暂停后继续加载
    const canplayHandler = () => {
      // 无论是播放下一首、上一首、循环播放,只要切换为播放状态，都需要等加载好再播放
      // 加载好设置为可播放状态
      songReady.value = true;
      // 加载好后,判断用户的行为来播放歌曲
      if (playing.value) {
        audioRef.value.play();
      }
    };

    // 5.audio时间改变
    const timeUpdateHandler = (e) => {
      // 设置当前歌曲进度
      store.dispatch(
        "setPlayerPlayProcess",
        (e.target.currentTime * 1000) / curSong.value?.detail?.songInfo.dt
      );
    };

    // 6.audio播放暂停
    const pasueHandler = () => {
      console.log("pasueHandler");
      store.dispatch("setPlayerPlaying", false);
    };

    // 7.audio播放结束
    const endedHandler = () => {
      // 播放完一首，设置播放状态、重置songReady
      store.dispatch("setPlayerPlaying", false);
      store.dispatch("setPlayerPlayProcess", 0);
      songReady.value = false;
      // 根据播放模式，选择播放下一首或循环播放
      if (playMode.value === 1) {
        loop();
      } else {
        next();
      }
    };

    // 8.audio播放出错
    const errorHandler = (e) => {
      console.log("errorHandler", e);
      if (curSong.value?.playable?.playable) {
        // 更新url
        updatePlaylistUrls();
      }
      // 播放出错时设置为暂停状态
      store.dispatch("setPlayerPlaying", false);
      // 设置songReady为true,由用户决定是否切歌
      songReady.value = true;
      // 提示用户歌曲播放出错
      message.error("当前歌曲播放出错,请重新尝试或切换其他歌曲", 3);
    };

    //更新播放列表的音乐播放地址
    const updatePlaylistUrls = async () => {
      const playlist = playList.value;
      const idsArr = playlist.map((s) => s.id);
      if (idsArr.length <= 0) return;
      const ids = idsArr.join(",");
      const res = await getSongUrl({ id: ids });
      if (res.code === 200) {
        store.dispatch("updatePlayerPlaylistUrls", res.data);
      }
      const audioEl = audioRef.value;
      const url = curSong.value.url;
      audioEl.src = url;
      store.dispatch("setPlayerPlaying", true);
    };

    // 9.单曲循环播放
    // 每首歌自然播放完调用,用户手动切换并不会调用
    const loop = () => {
      const audioEl = audioRef.value;
      audioEl.currentTime = 0;
      store.dispatch("setPlayerPlaying", true);
    };

    // 模式切换
    const playModeChange = () => {
      const newMode = (playMode.value + 1) % 3;
      store.dispatch("setPlayerPlayMode", newMode);
    };

    // 歌词翻译
    const translateLyric = () => {
      const transFlag = lyricTrans.value;
      lyricTrans.value = !transFlag;
    };

    // 固定按钮控制
    const fixedSwitch = () => {
      fixed.value = !fixed.value;
    };

    // 全屏切换
    const fullScreenSwitch = () => {
      if (height.value === "85px") {
        height.value = "100%";
        isFillScreen.value = true;
      } else {
        height.value = "85px";
        isFillScreen.value = false;
      }
    };

    // 关闭全屏
    const closeFullScreen = () => {
      height.value = "85px";
      isFillScreen.value = false;
    };

    // 播放器默认行为
    // 鼠标离开player下滑
    const mouseLeavePlayer = () => {
      if (fixed.value || isFillScreen.value) return;
      timer.value = setTimeout(() => {
        playFullScreenRef.value.style.bottom = "-55px";
      }, 2000);
    };

    // 鼠标在player上移
    const mouseOverPlayer = () => {
      if (timer.value) {
        clearTimeout(timer.value);
        timer.value = null;
      }
      playFullScreenRef.value.style.bottom = "0";
    };

    useLyricController();
    // 喜欢/取消喜欢歌曲
    const { likeASong } = useLikeSong();

    return {
      // data
      playFullScreenRef,
      audioRef,
      fixed,
      height,
      isFillScreen,
      songReady,
      lyricTrans,
      // vuex
      curSong,
      curSongDetail,
      playing,
      playMode,
      likedSongs,
      // methods
      togglePlay,
      pre,
      next,
      getVolume,
      getSongProcess,
      fixedSwitch,
      mouseLeavePlayer,
      mouseOverPlayer,
      playModeChange,
      fullScreenSwitch,
      closeFullScreen,
      timeUpdateHandler,
      endedHandler,
      errorHandler,
      pasueHandler,
      canplayHandler,
      islistInitLoad,
      translateLyric,
      likeASong,
      download,
    };
  },
};
</script>

<style lang="scss" scoped>
.playFullScreen {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 85px;
  background-color: #000;
  backdrop-filter: blur(100px);
  transition: height 1s ease, bottom 0.5s ease;
  .background {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    opacity: 0.6;
    filter: blur(100px);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .palyerMain {
    position: relative;
    height: calc(100% - 85px);
    .foldBtn {
      position: absolute;
      top: 40px;
      right: 40px;
      width: 28px;
      height: 28px;
      opacity: 0.5;
      &:hover {
        opacity: 1;
      }
    }
    .playerHeader {
      height: 100px;
      padding: 0 150px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left,
      .right {
        font-weight: 900;
        color: #d9d9da;
      }
      .left {
        height: 100px;
        line-height: 100px;
        font-size: 40px;
        img {
          width: 70px;
          height: 70px;
          opacity: 0.5;
          margin-bottom: 5px;
        }
      }
      .right {
        font-size: 30px;
      }
    }
    .playerbody {
      max-width: 1400px;
      height: calc(100% - 100px);
      display: flex;
      .playerLeft {
        width: 70%;
        height: 100%;
      }
      .playerRight {
        width: 30%;
        height: 100%;
        // background-color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .songInfo {
          width: 100%;
          height: 300px;
          margin-bottom: 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .pic {
            width: 220px;
            height: 200px;
            margin-bottom: 15px;
            background-image: url("@/assets/images/album_cover_player.png");
            background-size: auto, 100%;
            background-repeat: no-repeat;
            background-position: 20px, 0;
            img {
              width: 200px;
              height: 200px;
            }
          }
          .desc {
            width: 100%;
            text-align: center;
            font-size: 16px;
            color: #fff;
            opacity: 0.5;
            .songName,
            .singer,
            .albumName {
              width: 100%;
            }
          }
        }
      }
    }
  }
  .player {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    // transition: bottom 0.5s ease;
    display: flex;
    justify-content: center;
    .left {
      min-width: 350px;
      padding-left: 20px;
      .info {
        height: 100%;
        display: flex;
        align-items: center;
        .cover {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          overflow: hidden;
          margin-right: 15px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .desc {
          max-width: 220px;
          overflow: hidden;
          .songName {
            height: 20px;
            line-height: 20px;
            font-size: 20px;
            font-weight: 500;
            color: #fff;
            margin-bottom: 5px;
          }
          .singer {
            color: #a1a1a0;
          }
        }
      }
    }
    .center {
      margin: 0;
      height: 100%;
      .playerController {
        height: 100%;
        display: flex;
        justify-content: center;
        .btns {
          height: 100%;
          width: 200px;
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          .pre,
          .next {
            width: 35px;
            height: 35px;
            opacity: 0.8;
            &:hover {
              opacity: 1;
            }
          }
          .play {
            width: 50px;
            height: 50px;
            margin-left: 5px;
            opacity: 0.8;
            &:hover {
              opacity: 1;
            }
          }
          svg {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .right {
      width: 400px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      .mode,
      .collect,
      .translate,
      .download,
      .volume,
      .fullScreen {
        opacity: 0.8;
        &:hover {
          opacity: 1 !important;
        }
        cursor: pointer;
      }
      .fixed {
        width: 28px;
        height: 28px;
        opacity: 0.8;
        &:hover {
          opacity: 1;
        }
      }
    }
  }
}
</style>