<template>
  <div class="playerSongList">
    <div class="header">
      <ul>
        <li @click.stop="addToPlaylist">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-tianjia"></use></svg
          ><span>添加到</span>
        </li>
        <li @click="batchDownload">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xiazai5"></use></svg
          ><span>下载</span>
        </li>
        <li @click="batchDeletion">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jichu14-xianxing"></use></svg
          ><span>删除</span>
        </li>
        <li @click="clearPlayList">
          <svg class="icon last" aria-hidden="true">
            <use xlink:href="#icon-qingkong"></use></svg
          ><span>清空列表</span>
        </li>
      </ul>
    </div>
    <div class="body">
      <ul>
        <li>
          <div class="checkbox">
            <CheckBoxBC
              :inputId="-1"
              :checked="allChecked"
              @click="checkAll"
            ></CheckBoxBC>
          </div>
          <div class="number dark"></div>
          <div class="songName dark">歌曲</div>
          <div class="singer dark">歌手</div>
          <div class="timer dark">时长</div>
        </li>
        <li
          v-for="(song, index) in playList"
          :key="song.id"
          :class="{ disable: !song.playable.playable }"
          :data-key="song.id"
          @mouseenter="mouseEnterHandler"
          @mouseleave="mouseLeaveHandler"
        >
          <div class="checkbox">
            <CheckBoxBC
              :inputId="song.id"
              :checked="song.checked"
              @click="switchCheckBox(song.id)"
            ></CheckBoxBC>
          </div>
          <div
            class="number"
            :class="{ songNumber: song.id === curSong.id && playing }"
          >
            <span :class="{ hiddeIndex: song.id === curSong.id && playing }">{{
              index + 1
            }}</span>
          </div>
          <div class="songName">
            <span
              class="textoverflow-hidden-single"
              :style="{ opacity: song.id === curSong.id ? 1 : 0.5 }"
            >
              <span class="privilegeDesc" v-if="!song.playable.playable">{{
                song.playable.reason
              }}</span>
              {{ song?.detail.songInfo.name }}
            </span>
            <div class="opbtns" v-if="overID === song.id">
              <div
                class="play"
                v-if="song.playable.playable"
                @click="playSelectMusic(song.id)"
              >
                <svg
                  class="icon"
                  aria-hidden="true"
                  v-if="song.id === curSong.id && playing"
                >
                  <use xlink:href="#icon-bofangqi-zanting"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-else>
                  <use xlink:href="#icon-bofangqi-bofang"></use>
                </svg>
              </div>
              <div class="collect" @click="likeASong(song.id)">
                <svg
                  class="icon"
                  aria-hidden="true"
                  v-if="likedSongs.includes(song.id)"
                >
                  <use xlink:href="#icon-yizhuifan"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-else>
                  <use xlink:href="#icon-zhuifanshu"></use>
                </svg>
              </div>
              <div
                class="download"
                v-if="song.playable.playable"
                @click="download(song.url, song?.detail.songInfo.name)"
              >
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-xiazai5"></use>
                </svg>
              </div>
            </div>
          </div>
          <div class="singer textoverflow-hidden-single">
            <span :style="{ opacity: song.id === curSong.id ? 1 : 0.5 }">{{
              song?.detail.songInfo.ar.map((a) => a.name).join("/")
            }}</span>
          </div>
          <div class="timer">
            <div
              class="delete"
              v-if="overID === song.id"
              @click="deleteSong(song.id)"
            >
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-jichu14-xianxing"></use>
              </svg>
            </div>
            <span
              v-else
              :style="{ opacity: song.id === curSong.id ? 1 : 0.5 }"
              >{{ timeTransform(song?.detail.songInfo.dt) }}</span
            >
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { playlistMenubar } from "@/utils/customComponent";
import usePlayerSongListOp from "./hooks/usePlayerSongListOp";
import useLikeSong from "./hooks/useLikeSong";
import CheckBoxBC from "@/components/base/CheckBoxBC.vue";
import { timeTransform, download } from "@/utils/utils";
import { useStore } from "vuex";
import { ref, computed } from "vue";
export default {
  name: "PlayerSongList",
  components: { CheckBoxBC },
  setup() {
    // data
    const overID = ref(-1);

    // vuex
    const store = useStore();
    const playList = computed(() => store.getters.getPlayList);
    const shuffledList = computed(() => store.getters.getShuffledList);
    const curSong = computed(() => store.getters.getCurSong);
    const currentIndex = computed(() => store.getters.getCurrentIndex);
    const playing = computed(() => store.getters.getPlaying);
    const playMode = computed(() => store.getters.getPlayMode);
    const likedSongs = computed(() => store.getters.getLikedSongs);
    const allChecked = computed(
      () => playList.value.every((s) => s.checked) && playList.value.length > 0
    );

    // hooks
    // 喜欢/取消喜欢
    const { likeASong } = useLikeSong();
    const { clearPlayList, batchDeletion, deleteSong, batchDownload } =
      usePlayerSongListOp();

    // methods
    // 1.鼠标悬浮高亮
    const mouseEnterHandler = (e) => {
      overID.value = e.target.dataset.key * 1;
    };
    const mouseLeaveHandler = (e) => {
      overID.value = -1;
    };
    // 2.播放选中音乐
    const playSelectMusic = (selectedID) => {
      const curID = curSong.value.id;
      if (selectedID !== curID) {
        let selectedIndex = 0;
        // 根据不同播放模式查找对应索引
        if (playMode.value === 2) {
          selectedIndex = shuffledList.value.findIndex(
            (song) => song.id === selectedID
          );
        } else {
          selectedIndex = playList.value.findIndex(
            (song) => song.id === selectedID
          );
        }
        store.dispatch("setPlayerCurrentIndex", selectedIndex);
      } else {
        // 选择同一首歌,切换播放状态
        store.dispatch("setPlayerPlaying", !playing.value);
      }
    };

    //单选一首歌曲
    const switchCheckBox = (id) => {
      store.dispatch("updatePlayerPlayList", { op: 0, id });
    };

    // 全选歌曲
    const checkAll = () => {
      store.dispatch("batchChecked", !allChecked.value);
    };

    // 添加到
    const addToPlaylist = (e) => {
      const menubarTop = e.clientY;
      const menubarLeft = e.clientX;
      playlistMenubar({ menubarTop, menubarLeft });
    };

    return {
      overID,
      // vuex
      playList,
      curSong,
      currentIndex,
      playing,
      likedSongs,
      allChecked,
      // hooks
      likeASong,
      clearPlayList,
      // methods
      timeTransform,
      mouseEnterHandler,
      mouseLeaveHandler,
      playSelectMusic,
      download,
      batchDeletion,
      deleteSong,
      batchDownload,
      checkAll,
      switchCheckBox,
      addToPlaylist,
    };
  },
};
</script>

<style lang="scss" scoped>
.playerSongList {
  color: #fff;
  height: 100%;
  .header {
    height: 50px;
    ul {
      height: 100%;
      padding-left: 15px;
      display: flex;
      align-items: center;
      li {
        width: 130px;
        height: 40px;
        line-height: 38px;
        border: 1px solid #fff;
        margin-right: 10px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        opacity: 0.5;
        &:hover {
          opacity: 1;
        }
        transition: opacity 0.2s ease;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        svg {
          width: 20px;
          height: 20px;
          margin-right: 2px;
        }
        .last {
          width: 17px;
          height: 17px;
          margin-right: 5px;
        }
      }
    }
  }
  .body {
    height: calc(100% - 70px);
    margin-top: 20px;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 5px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-button {
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #686766;
      border-radius: 5px;
    }
    ul {
      height: 100%;
      padding: 0 0 0 15px;
      .disable {
        opacity: 0.3;
      }
      li {
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .dark {
          opacity: 0.5;
          cursor: default;
        }
        .songNumber {
          background-image: url("@/assets/images/wave.gif");
          background-repeat: no-repeat;
          background-position: center;
          opacity: 1 !important;
        }
        .hiddeIndex {
          opacity: 0;
        }
        .songName,
        .singer,
        .timer {
          span {
            opacity: 0.5;
            transition: opacity 0.2s ease;
            cursor: pointer;
            &:hover {
              opacity: 1;
            }
            .privilegeDesc {
              padding: 0 4px;
              border: 1px solid #fff;
              border-radius: 5px;
              font-size: 12px;
              opacity: 1 !important;
            }
          }
        }
        .number {
          opacity: 0.5;
          cursor: default;
          span {
            transition: opacity 0.5s ease;
          }
        }
        .checkbox {
          width: 5%;
          height: 20px;
        }
        .number {
          width: 5%;
          padding-right: 15px;
          text-align: right;
        }
        .songName {
          width: 60%;
          display: flex;
          align-items: center;
          span {
            display: inline-block;
            flex-grow: 1;
          }
          .opbtns {
            width: 140px;
            padding: 0 15px;
            flex-shrink: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            .play,
            .collect,
            .add,
            .download {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 28px;
              height: 28px;
              border: 1px solid #fff;
              border-radius: 50%;
              opacity: 0.5;
              &:hover {
                opacity: 1;
              }
              svg {
                width: 18px;
                height: 18px;
              }
            }
          }
        }
        .singer {
          width: 20%;
        }
        .timer {
          width: 10%;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          .delete {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 28px;
            height: 28px;
            border: 1px solid #fff;
            border-radius: 50%;
            opacity: 0.5;
            cursor: pointer;
            &:hover {
              opacity: 1;
            }
            svg {
              width: 18px;
              height: 18px;
            }
          }
        }
      }
    }
  }
}
</style>