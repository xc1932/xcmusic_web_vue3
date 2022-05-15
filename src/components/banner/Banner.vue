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
      <swiper-slide v-for="(banner, index) in banners" :key="index">
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
import { getBanner } from "@/api/others";
import { computed, ref } from "vue";
export default {
  name: "Banner",
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    // data
    const banners = ref([]);
    const swiperObj=ref({})
    // computed
    const initialSlide=computed(()=>Math.floor(banners.value.length/2))

    // 获取banner
    const getBanners = async () => {
      const res = await getBanner({
        type: 0,
      });
      if (res.code === 200) {
        banners.value = res.banners;
        swiperObj.value.slideTo(initialSlide.value)
      }
    };
    // swiper初始化完成事件
    const onSwiper=(swiper)=>{
      swiperObj.value=swiper
    }
    getBanners();
    return {
      banners,
      onSwiper,
      modules: [Navigation, Pagination, Autoplay, EffectCoverflow],
    };
  },
};
</script>

<style lang='scss' scoped>
.banner {
  margin: 50px 0;
  .swiper {
    img {
      width: 100%;
    }
  }
}
</style>