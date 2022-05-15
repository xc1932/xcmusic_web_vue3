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
      <div class="palyerMain">
        <div class="playerHeader">
          <div class="left">我的音乐</div>
          <div class="right">用户信息</div>
        </div>
        <div class="playerbody center">
          <div class="playerLeft">
            <player-song-list></player-song-list>
          </div>
          <div class="playerRight"></div>
        </div>
      </div>
      <div class="player">
        <div class="left">
          <div class="info">
            <div class="cover">
              <img :src="curSongDetail?.songInfo.al.picUrl" />
            </div>
            <div class="desc">
              <div class="songName textoverflow-hidden-single">
                {{ curSongDetail?.songInfo.name }}
              </div>
              <div class="singer">
                {{ curSongDetail?.songInfo.ar[0].name }}
              </div>
            </div>
          </div>
        </div>
        <div class="center">
          <div class="playerController">
            <div class="btns">
              <div class="pre" @click="pre" v-clickZoomOut>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-bofangqi-shangyishou"></use>
                </svg>
              </div>
              <div class="play" @click="togglePlay" v-clickZoomOut>
                <svg class="icon" aria-hidden="true" v-if="!playing">
                  <use xlink:href="#icon-bofangqi-bofang"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-else>
                  <use xlink:href="#icon-bofangqi-zanting"></use>
                </svg>
              </div>
              <div class="next" @click="next" v-clickZoomOut>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-bofangqi-xiayishou"></use>
                </svg>
              </div>
            </div>
            <div class="process">
              <div class="top">
                <div class="lyrics">无名的人-毛不易</div>
                <div class="timer">00:48 / 04:42</div>
              </div>
              <div class="processBar">
                <div class="line"></div>
                <div class="circle"></div>
              </div>
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
          <div class="collect">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuifanshu"></use>
            </svg>
            <!-- <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-yizhuifan"></use>
          </svg> -->
          </div>
          <div class="playlist">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-liebiao5"></use>
            </svg>
          </div>
          <div class="volume">
            <volume-controller @volumeChanged="getVolume"></volume-controller>
          </div>
          <div class="fullScreen" @click="fullScreenSwitch">
            <svg class="icon" aria-hidden="true">
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
        <audio ref="audioRef"></audio>
      </div>
    </div>
  </teleport>
</template>

<script>
import PlayerSongList from './PlayerSongList.vue'
import VolumeController from "./VolumeController.vue";
import { useStore } from "vuex";
import { ref, computed, watch, onMounted } from "vue";
export default {
  name: "Player",
  components: { VolumeController,PlayerSongList },
  setup() {
    // data
    const playFullScreenRef = ref(null);
    const audioRef = ref(null);
    const fixed = ref(true); //播放器固定控制
    const timer = ref(null); //播放器等待下滑计时
    const islistInitLoad = ref(true);
    const height = ref("85px");
    const isFillScreen = ref(false);

    // vuex && computed
    const store = new useStore();
    // 当前歌曲的详情、url、歌词、播放状态、播放音乐索引、歌曲列表、
    const currentIndex = computed(() => store.getters.getCurrentIndex);
    const playList = computed(() => store.getters.getPlayList);
    const curSong = computed(() => store.getters.getCurSong);
    const curSongDetail = computed(() => curSong.value.detail);
    const playing = computed(() => store.getters.getPlaying);
    const playMode = computed(() => store.getters.getPlayMode);

    // watch
    // 1.监听当前歌曲的变化，切换新歌曲地址
    watch(curSong, (newSong) => {
      const audioEl = audioRef.value;
      if (!newSong || !audioEl) return;
      const url = newSong.url;
      // 每次当前歌曲变化都会设置新的url
      audioEl.src = url;
      // player初次渲染只设置url不播放,之后每次改变歌曲都会播放歌曲
      if (islistInitLoad.value) {
        islistInitLoad.value = false;
        return;
      }
      // 保证播放状态切换歌曲,会自动播放
      audioEl.play();
      store.dispatch("setPlayerPlaying", true);
    });

    // 2.监听播放状态的变化，播放或暂停歌曲
    watch(playing, (newPlaying) => {
      const audioEl = audioRef.value;
      if (newPlaying) {
        audioEl.play();
      } else {
        audioEl.pause();
      }
    });

    // 生命周期钩子
    onMounted(() => {
      store.dispatch("setPlayerPlaying", false);
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

    // 4.音量控制
    const getVolume = (newVolume) => {
      audioRef.value.volume = newVolume;
    };

    // 5.固定按钮控制
    const fixedSwitch = () => {
      fixed.value = !fixed.value;
    };

    // 6.模式切换
    const playModeChange = () => {
      const newMode = (playMode.value + 1) % 3;
      store.dispatch("setPlayerPlayMode", newMode);
    };

    // 7.全屏切换
    const fullScreenSwitch = () => {
      if (height.value === "85px") {
        height.value = "100%";
        isFillScreen.value = true;
      } else {
        height.value = "85px";
        isFillScreen.value = false;
      }
    };
    fullScreenSwitch();
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

    return {
      // data
      playFullScreenRef,
      audioRef,
      fixed,
      height,
      // vuex
      curSongDetail,
      playing,
      playMode,
      // methods
      togglePlay,
      pre,
      next,
      getVolume,
      fixedSwitch,
      mouseLeavePlayer,
      mouseOverPlayer,
      playModeChange,
      fullScreenSwitch,
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
    height: calc(100% - 85px);
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
        font-size: 40px;
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
        .process {
          width: 700px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .top {
            width: 95%;
            height: 30px;
            color: #bfbab9;
            display: flex;
            justify-content: space-between;
          }
          .processBar {
            position: relative;
            width: 95%;
            height: 2px;
            background-color: #796156;
            .line {
              width: 50%;
              height: 100%;
              background-color: #d5cfcd;
            }
            .circle {
              position: absolute;
              top: 0;
              left: 0;
              transform: translateY(-40%);
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background-color: #fff;
            }
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
      .playlist,
      .volume,
      .fullScreen {
        opacity: 0.8;
        &:hover {
          opacity: 1;
        }
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