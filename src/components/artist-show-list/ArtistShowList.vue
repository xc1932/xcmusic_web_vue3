<template>
  <div
    class="similarartistsection"
    v-if="finalSimilarArtists.length > 0"
    ref="similarArtistSectionRef"
  >
    <div class="body">
      <div
        class="similarArtistItem"
        v-for="similarArtist in finalSimilarArtists"
        :key="similarArtist.id"
      >
        <rectangle-show-box
          boxWidth="190px"
          boxHeight="190px"
          imgHeight="190px"
          imgRadius="50%"
          :imgUrl="similarArtist.artistAvatar"
          @playbtnClick="playAllSongOfArtist(similarArtist.id)"
          @imgboxClick="toArtistView(similarArtist.id)"
        >
          <div class="artistName">{{ similarArtist.artistName }}</div>
        </rectangle-show-box>
      </div>
    </div>
  </div>
</template>

<script>
import useHomeViewControls from "@/views/hooks/useHomeViewControls";
import RectangleShowBox from "@/components/base/RectangleShowBox.vue";
import { useRouter } from "vue-router";
import { ref, toRefs, watch } from "vue";
export default {
  name: "SimilarArtistSection",
  components: { RectangleShowBox },
  props: {
    similarArtists: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
    },
  },
  setup(props, { emit }) {
    // router
    const router = useRouter();

    // hooks
    const { playAllSongOfArtist } = useHomeViewControls();

    // data
    const similarArtistSectionRef = ref(null);
    const { similarArtists } = toRefs(props);
    const finalSimilarArtists = ref([]);

    //watch
    watch(
      similarArtists,
      (newVal) => {
        finalSimilarArtists.value = newVal.slice(0);
      },
      { immediate: true }
    );

    // methods
    // 1.跳转到专辑页面
    const toArtistView = (artistId) => {
      router.push(`/artist/${artistId}`);
    };

    return {
      // data
      similarArtistSectionRef,
      similarArtists,
      finalSimilarArtists,
      // methods
      toArtistView,
      playAllSongOfArtist,
    };
  },
};
</script>

<style lang='scss' scoped>
.similarartistsection {
  @include not-allowed-select;
  .body {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    width: 1230px;
    .similarArtistItem {
      margin: 0 15px 40px 0;
      width: 190px;
      .artistName {
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        font-weight: 700;
        text-align: center;
      }
    }
  }
}
</style>