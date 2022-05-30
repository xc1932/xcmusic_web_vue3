<template>
  <div
    class="latestreleasesection"
    v-if="latestRelease.latestAlbum || latestRelease.latestMV"
  >
    <div class="header">最新发布</div>
    <div class="body">
      <div class="left" v-if="latestRelease.latestAlbum">
        <div
          class="cover"
          @mouseenter="enterLeftCoverHandler"
          @mouseleave="leaveLeftCoverHandler"
          @click.stop="toAlbumView(latestRelease.latestAlbum.id)"
        >
          <div
            class="btn"
            ref="leftBtnRef"
            @click.stop="playAllSongInAlbum(latestRelease.latestAlbum)"
          >
            <play-btn></play-btn>
          </div>
          <img
            v-lazy="latestRelease.latestAlbum.albumCover"
            class="albumCover"
          />
        </div>
        <div class="desc">
          <div class="title textoverflow-hidden-single">
            {{ latestRelease.latestAlbum.albumName }}
          </div>
          <div class="date textoverflow-hidden-single">
            {{ latestRelease.latestAlbum.albumPublishTime }}
          </div>
          <div class="info textoverflow-hidden-single">
            {{ latestRelease.latestAlbum.albumType }}·{{
              latestRelease.latestAlbum.size
            }}首歌曲
          </div>
        </div>
      </div>
      <div class="right" v-if="latestRelease.latestMV">
        <div
          class="cover"
          @mouseenter="enterRightCoverHandler"
          @mouseleave="leaveRightCoverHandler"
          @click.stop="toMVView(latestRelease.latestMV.id)"
        >
          <div class="btn" ref="rightBtnRef">
            <play-btn></play-btn>
          </div>
          <img v-lazy="latestRelease.latestMV.mvCover" class="mvCover" />
        </div>
        <div class="desc">
          <div class="title textoverflow-hidden-single">
            {{ latestRelease.latestMV.mvName }}
          </div>
          <div class="date textoverflow-hidden-single">
            {{ latestRelease.latestMV.mvPublishTime }}
          </div>
          <div class="info textoverflow-hidden-single">最新MV</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useHomeViewControls from "@/views/hooks/useHomeViewControls";
import PlayBtn from "@/components/base/PlayBtn.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
export default {
  name: "LatestReleaseSection",
  components: { PlayBtn },
  props: ["latestRelease"],
  setup() {
    // vue-router
    const router = useRouter();

    // hooks
    const { playAllSongInAlbum } = useHomeViewControls();

    // data
    const leftBtnRef = ref(null);
    const rightBtnRef = ref(null);
    // methods
    // 1.鼠标进入离开事件处理
    const enterLeftCoverHandler = () => {
      leftBtnRef.value.style.opacity = 1;
    };
    const leaveLeftCoverHandler = () => {
      leftBtnRef.value.style.opacity = 0;
    };
    const enterRightCoverHandler = () => {
      rightBtnRef.value.style.opacity = 1;
    };
    const leaveRightCoverHandler = () => {
      rightBtnRef.value.style.opacity = 0;
    };
    // 2.专辑播放按钮点击事件
    const toAlbumView = (albumId) => {
      router.push(`/album/${albumId}`);
    };
    const toMVView = (mvId) => {
      router.push(`/mv/${mvId}`);
    };
    return {
      // data
      leftBtnRef,
      rightBtnRef,
      // methods
      enterLeftCoverHandler,
      leaveLeftCoverHandler,
      enterRightCoverHandler,
      leaveRightCoverHandler,
      toAlbumView,
      toMVView,
      playAllSongInAlbum,
    };
  },
};
</script>

<style lang='scss' scoped>
.latestreleasesection {
  .header {
    height: 50px;
    line-height: 50px;
    font-size: 22px;
    font-weight: 700;
  }
  .body {
    display: flex;
    justify-content: space-between;
    .left,
    .right {
      display: flex;
      .cover {
        margin-right: 30px;
        height: 150px;
        border-radius: 15px;
        transition: all 0.4s ease;
        overflow: hidden;
        &:hover {
          box-shadow: -4px 4px 15px 2px rgba(0, 0, 0, 0.2);
          transform: scale(1.0005);
        }
        img {
          height: 150px;
        }
      }
      .desc {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 150px;
        .title {
          margin-bottom: 2px;
          width: 100%;
          font-size: 18px;
          font-weight: 700;
        }
        .date {
          width: 100%;
          font-size: 14px;
          font-weight: 500;
        }
        .info {
          width: 100%;
          font-size: 12px;
        }
      }
      .albumCover {
        width: 150px;
      }
      .mvCover {
        width: 270px;
      }
    }
    .left,
    .right {
      .cover {
        position: relative;
        .btn {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          width: 50px;
          height: 50px;
          opacity: 0;
        }
      }
    }
  }
}
</style>