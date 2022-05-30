<template>
  <div class="mvview">
    <div class="container center" v-if="mvDetail">
      <div class="video">
        <video
          controls
          ref="videoRef"
          :src="mvUrl"
          :poster="mvDetail?.mvCover"
          @playing="playingHandler"
          @pause="pauseHandler"
          @ended="endedHandler"
        ></video>
        <div class="playBtn" ref="playBtnRef" @click.stop="playMV">
          <play-btn></play-btn>
        </div>
      </div>
      <div class="mvInfoSection">
        <div class="top">
          <span
            class="singerName"
            @click.stop="toArtistView(mvDetail.artistId)"
            >{{ mvDetail?.artistName }}</span
          >
          <span class="mvName">-{{ mvDetail?.mvName }}</span>
          <div class="like" v-clickZoomOut>
            <img
              src="@/assets/svg/like2.svg"
              v-if="realLiked"
              @click.stop="unlikeMV(mvDetail.id)"
            />
            <img
              src="@/assets/svg/like.svg"
              v-else
              @click.stop="likeMV(mvDetail.id)"
            />
          </div>
        </div>
        <div class="center">
          <div class="playCount">
            {{
              playCountConvert(mvDetail?.mvPlayCount)
            }}&nbsp;Views&nbsp;·&nbsp;
          </div>
          <div class="publishTime">{{ mvDetail?.mvPublishTime }}</div>
        </div>
        <div class="bottom">
          {{ mvDetail?.mvDesc }}
        </div>
      </div>
      <div class="similarMVs">
        <mv-show-section
          title="更多视频"
          :mvlist="similarMVs"
        ></mv-show-section>
      </div>
    </div>
  </div>
</template>

<script>
import PlayBtn from "@/components/base/PlayBtn.vue";
import MvShowSection from "@/components/mv-show-section/MvShowSection.vue";
import { playCountConvert } from "@/utils/utils";
import { getMVDetail, getMVUrl, getSimilarMV, likeAMV } from "@/api/mv";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, computed, watch } from "vue";
export default {
  name: "MVView",
  components: { MvShowSection, PlayBtn },
  props: ["id"],
  setup(props) {
    // vue-router
    const router = useRouter();
    // vuex
    const store = useStore();
    const liked = computed(() =>
      store.getters.getLikedMVs.map((mv) => mv.vid * 1).includes(id * 1)
    );
    // data
    const { id } = props;
    const videoRef = ref(null);
    const playBtnRef = ref(null);
    const mvDetail = ref(null);
    const mvUrl = ref(undefined);
    const similarMVs = ref([]);
    const realLiked = ref(false);

    // watch
    watch(
      liked,
      (newVal) => {
        realLiked.value = newVal;
      },
      { immediate: true }
    );

    // methods
    // 1.获取数据
    const initData = async () => {
      const task1 = getMVDetail({ mvid: id });
      const task2 = getMVUrl({ id });
      const task3 = getSimilarMV({ mvid: id });
      const res = await Promise.all([task1, task2, task3]);
      // 获取mv详细信息
      if (res[0].code === 200) {
        const { data } = res[0];
        mvDetail.value = {
          id: data.id,
          mvName: data.name,
          mvCover: data.cover,
          mvDesc: data.desc,
          mvPublishTime: data.publishTime,
          mvPlayCount: data.playCount,
          mvBrs: data.brs,
          artistId: data.artistId,
          artistName: data.artistName,
        };
      }
      // 获取mv路径
      if (res[1].code === 200) {
        mvUrl.value = res[1].data.url;
      }
      // 获取相似mv
      if (res[2].code === 200) {
        similarMVs.value = res[2].mvs.map((m) => {
          return {
            id: m.id,
            mvName: m.name,
            mvCover: m.cover,
            mvDuration: m.duration,
            mvDesc: m.desc,
            artistId: m.artistId,
            artistName: m.artistName,
          };
        });
      }
    };
    // 2.跳转到歌手页面
    const toArtistView = (artistId) => {
      router.push(`/artist/${artistId}`);
    };
    // 3.收藏一个MV
    const likeMV = (mvid) => {
      realLiked.value = true;
      likeAMV({ t: 1, mvid }).then((res) => {
        if (res.code === 200) {
          store.dispatch("setLikedMVs");
        }
      });
    };
    // 4.取消收藏一个MV
    const unlikeMV = (mvid) => {
      realLiked.value = false;
      likeAMV({ t: 2, mvid }).then((res) => {
        if (res.code === 200) {
          store.dispatch("setLikedMVs");
        }
      });
    };
    // 5.播放视频
    const playMV = () => {
      videoRef.value.play();
    };
    // 6.暂停播放
    const pauseHandler = () => {
      playBtnRef.value.style.opacity = 1;
    };
    // 7.播放结束
    const endedHandler = () => {
      playBtnRef.value.style.opacity = 1;
    };
    // 8.播放已经开始
    const playingHandler = () => {
      playBtnRef.value.style.opacity = 0;
      store.dispatch("setPlayerPlaying", false);
    };
    // init data
    initData();

    return {
      // data
      videoRef,
      playBtnRef,
      mvDetail,
      mvUrl,
      similarMVs,
      liked,
      realLiked,
      // methods
      playCountConvert,
      toArtistView,
      likeMV,
      unlikeMV,
      playMV,
      playingHandler,
      pauseHandler,
      endedHandler,
    };
  },
};
</script>

<style lang='scss' scoped>
.mvview {
  margin: 75px auto 0;
  padding-bottom: 90px;
  height: calc(100% - 100px);
  overflow: auto;
  .video {
    position: relative;
    margin: 20px 0;
    width: 100%;
    // height: 680px;
    border-radius: 15px;
    overflow: hidden;
    video {
      width: 100%;
      height: 100%;
    }
    .playBtn {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      opacity: 1;
      transition: opacity 0.5s ease;
    }
  }
  .mvInfoSection {
    .top {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .singerName,
      .mvName {
        font-size: 24px;
        font-weight: 900;
      }
      .singerName {
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
      .like {
        margin-left: 15px;
        width: 20px;
        height: 20px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .center {
      margin-bottom: 10px;
      display: flex;
      opacity: 0.5;
      .playCount,
      .publishTime {
        font-size: 14px;
        font-weight: 600;
      }
    }
    .bottom {
      @include text-overflow-hidden;
    }
  }
}
</style>