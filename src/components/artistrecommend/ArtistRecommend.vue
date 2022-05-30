<template>
  <div class="artistrecommend container center">
    <div class="title">推荐歌手</div>
    <swiper
      :modules="modules"
      :grabCursor="true"
      @swiper="onSwiper"
      :slides-per-view="6"
      :speed="10000"
      :loop="true"
      :autoplay="{
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }"
    >
      <swiper-slide v-for="artist in artists" :key="artist.id">
        <div class="wrapper">
          <rectangle-show-box
            :imgUrl="artist.img1v1Url"
            boxWidth="190px"
            boxHeight="190px"
            imgHeight="190px"
            imgRadius="50%"
            @playbtnClick="playAllSongOfArtist(artist.id)"
            @click="toArtistView(artist.id)"
          >
          </rectangle-show-box>
          <div class="name">{{ artist.name }}</div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { Navigation, Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import RectangleShowBox from "@/components/base/RectangleShowBox";
import useHomeViewControls from "@/views/hooks/useHomeViewControls";
import { useRouter } from "vue-router";
import { ref } from "vue";
export default {
  name: "ArtistRecommend",
  components: { RectangleShowBox, Swiper, SwiperSlide },
  props: {
    artists: {
      type: Array,
      default: [],
    },
  },
  setup(props) {
    // data
    const swiperObj = ref({});

    // router
    const router = useRouter();

    // hooks
    const { playAllSongOfArtist } = useHomeViewControls(0);
    // methods
    // swiper初始化完成事件
    const onSwiper = (swiper) => {
      swiperObj.value = swiper;
    };
    // 跳转到歌手页面
    const toArtistView = (id) => {
      router.push(`/artist/${id}`);
    };
    return {
      // swiper
      onSwiper,
      modules: [Navigation, Pagination, Autoplay],
      // hooks
      playAllSongOfArtist,
      // methods
      toArtistView,
    };
  },
};
</script>

<style lang='scss' scoped>
.artistrecommend {
  margin-bottom: $margin-bottom;
  .title {
    height: 45px;
    line-height: 45px;
    font-size: $font-size-large-x;
    font-weight: $font-weight-large-x;
  }
  .wrapper {
    padding-top: 10px;
    .center {
      margin: 0 auto;
    }
    .name {
      padding-top: 5px;
      text-align: center;
      font-weight: 700;
    }
  }
}
</style>