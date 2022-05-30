<template>
  <div class="songshowlist">
    <div
      class="item"
      v-clickZoomOut:[0.99]
      v-for="(item, index) in songlist"
      :key="item.id"
      :class="{ disable: !item.playable.playable }"
      :style="{ backgroundColor: currentId === item.songId ? '#eee' : '' }"
      @mouseenter="enterItem(index)"
      @mouseleave="leaveItem"
      @click.stop="playAllMusicInAlbum(item.songId)"
    >
      <div class="left">
        <div class="indexvolume">
          <div
            class="volume"
            v-if="hoverIndex === index || currentId === item.songId"
          >
            <img
              src="@/assets/svg/volume.svg"
              v-mousehoverZoom
              v-if="currentId === item.songId"
            />
            <img src="@/assets/svg/play.svg" v-mousehoverZoom v-else />
          </div>
          <span class="index" v-else>{{ index + 1 }}</span>
        </div>
        <div class="desc">
          <div class="songname textoverflow-hidden-single">
            <span>{{ item.songName }}</span>
          </div>
        </div>
      </div>
      <div class="right textoverflow-hidden-single">
        <span>{{ item.time }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref } from "vue";
export default {
  name: "SongPlayList",
  props: {
    songlist: {
      type: Array,
      default: [],
    },
    currentId: {
      type: Number,
      default: -1,
    },
  },
  emits: ["playAllMusicInAlbum"],
  setup(props,{emit}) {
    // router
    const router = useRouter();

    // data
    const hoverIndex = ref(-1);

    // methods
    //1.鼠标进入离开事件处理
    const enterItem = (index) => {
      hoverIndex.value = index;
    };

    const leaveItem = () => {
      hoverIndex.value = -1;
    };

    // 2.播放专辑中的所有音乐
    const playAllMusicInAlbum = (currentSongId) => {
      emit("playAllMusicInAlbum", currentSongId);
    };

    return {
      // data
      hoverIndex,
      // methods
      enterItem,
      leaveItem,
      playAllMusicInAlbum,
    };
  },
};
</script>

<style lang='scss' scoped>
.songshowlist {
  padding: 5px 0;
  .disable {
    filter: grayscale(1) opacity(0.6);
  }
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    height: 45px;
    border-radius: 10px;
    cursor: pointer;
    @include not-allowed-select;
    &:hover {
      background-color: #f5f5f7;
    }
    .left {
      flex-grow: 1;
      display: flex;
      align-items: center;
      .indexvolume {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
        width: 30px;
        height: 30px;
        font-size: 20px;
        font-weight: 700;
        .volume {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          img {
            width: 18px;
            height: 18px;
            margin: 0;
          }
        }
      }
      img {
        margin-right: 15px;
        width: 30px;
        height: 30px;
        border-radius: 5px;
      }
      .desc {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 600px;
        .songname {
          span {
            font-size: 16px;
            font-weight: 700;
          }
        }
      }
    }
    .right {
      width: 50px;
      font-size: 20px;
      text-align: center;
    }
  }
}
</style>