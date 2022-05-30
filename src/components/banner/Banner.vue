<template>
  <div class="banner center">
    <swiper
      :modules="modules"
      :grabCursor="true"
      slideToClickedSlide
      updateOnImagesReady
      :preloadImages="false"
      :initialSlide="0"
      :slides-per-view="3"
      :loopAdditionalSlides="5"
      :centered-slides="true"
      :loop="true"
      @swiper="onSwiper"
      :navigation="{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }"
      :pagination="{ clickable: true, dynamicBullets: true }"
      :autoplay="{
        delay: 2500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }"
      :effect="'coverflow'"
      :coverflow-effect="{
        rotate: 22,
        stretch: 150,
        depth: 300,
        modifier: 1,
        slideShadows: true,
      }"
    >
      <swiper-slide
        v-for="(banner, index) in banners"
        :key="index"
        @click.stop="toCorrespondingView(banner)"
      >
        <img :src="banner.imageUrl" :alt="banner.typeTitle" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { ref, toRefs } from "vue";
import router from "@/router";
export default {
  name: "Banner",
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    banners: {
      type: Array,
      default: [],
    },
  },
  setup(props) {
    // data
    const { banners } = toRefs(props);
    const swiperObj = ref(null);
    // computed
    // const initialSlide = computed(() => Math.floor(banners.value.length / 2));

    // swiper初始化完成事件
    const onSwiper = (swiper) => {
      swiperObj.value = swiper;
      // swiperObj.value.slideTo(initialSlide.value);
    };

    // motheds
    const toCorrespondingView = (banner) => {
      const { targetType, targetId, url } = banner;
      // targetType:
      // 1：单曲(tragetId)
      // 10:专辑(tragetId)
      // 1000：歌单(tragetId)
      // 1004: MV(targetId)
      // 3000：专题,直接跳转(url)
      switch (targetType) {
        case 1:
          break;
        case 10:
          router.push(`/album/${targetId}`);
          break;
        case 1000:
          router.push(`/playlist/${targetId}`);
          break;
        case 1004:
          router.push(`/mv/${targetId}`);
          break;
        default:
          url !== null ? (window.location.href = url) : "";
      }
    };
    return {
      // data
      banners,
      // methods
      toCorrespondingView,
      // swiper
      onSwiper,
      modules: [Navigation, Pagination, Autoplay, EffectCoverflow],
    };
  },
};
</script>

<style lang='scss' scoped>
.banner {
  margin: 50px 0;
  @include not-allowed-select;
  .swiper {
    img {
      width: 100%;
    }
  }
}
</style>