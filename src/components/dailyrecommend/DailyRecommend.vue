<template>
  <div class="dailyrecommend center" @click.stop="toDailyView">
    <img :src="imgUrl" />
    <div class="title">
      <div class="letter">每</div>
      <div class="letter">日</div>
      <div class="letter">推</div>
      <div class="letter">荐</div>
    </div>
    <div class="play" v-clickZoomOut @click="playDailySongs">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-play"></use>
      </svg>
    </div>
  </div>
</template>

<script>
import { defaultImgUrl } from "@/utils/constant";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  name: "DailyRecommend",
  props: {
    dailySongs: {
      type: Array,
      default: [],
    },
  },
  setup(props) {
    // vue-router
    const router = useRouter();

    // data
    let imgUrl = computed(() =>
      props.dailySongs.length > 0
        ? props.dailySongs[0].al.picUrl
        : defaultImgUrl
    );
    let songName = computed(() =>
      props.dailySongs.length > 0 ? props.dailySongs[0].name : ""
    );

    // vuex
    const store = useStore();
    // methods
    // 1.播放每日推荐歌曲
    const playDailySongs = () => {
      const dailysongs = props.dailySongs;
      const dailySongsIds = dailysongs.map((item) => item.id);
      store.dispatch("setPlayerPlayList", dailySongsIds);
    };
    // 2.跳转到每日推荐页面
    const toDailyView = () => {
      router.push("/daily");
    };
    return {
      // data
      imgUrl,
      songName,
      // methods
      playDailySongs,
      toDailyView,
    };
  },
};
</script>

<style lang='scss' scoped>
@keyframes imgMove {
  from {
    transform: translateY(-10%);
  }
  to {
    transform: translateY(calc(-100% + 200px));
  }
}
.dailyrecommend {
  position: relative;
  margin: 0;
  width: 590px;
  height: 200px;
  border-radius: $border-radius-rectangle;
  box-shadow: -4px 4px 15px 2px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  img {
    width: 100%;
    animation: imgMove 20s ease-in-out 3s infinite alternate backwards;
  }
  .title {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    left: 30px;
    width: 140px;
    height: 140px;
    display: flex;
    flex-wrap: wrap;
    flex-shrink: 0;
    .letter {
      width: 70px;
      height: 70px;
      line-height: 70px;
      text-align: center;
      font-size: 60px;
      font-weight: 900;
      color: $color-bg-white;
    }
  }
  .play {
    width: 50px;
    height: 50px;
    border-radius: $border-radius-circle;
    @include bg-frostedglass;
    position: absolute;
    bottom: 20px;
    right: 35px;
    margin: auto;
    transition: all 0.3s;
    &:hover {
      @include bg-frostedglass-deep;
    }
    svg {
      position: absolute;
      top: 50%;
      left: 54%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>