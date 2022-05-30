<template>
  <div
    class="similarartistsection"
    v-if="finalSimilarArtists.length > 0"
    ref="similarArtistSectionRef"
  >
    <div class="header" v-if="title">
      <div class="title">{{ title }}</div>
      <div
        class="showmoreBtn"
        v-show="!hasShowMore && similarArtists.length > 12"
        @click.stop="showMore"
      >
        显示更多
      </div>
    </div>
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
    <div class="foldBtn" v-show="hasShowMore" @click.stop="fold">收起</div>
  </div>
</template>

<script>
import useHomeViewControls from "@/views/hooks/useHomeViewControls";
import RectangleShowBox from "@/components/base/RectangleShowBox.vue";
import { useRouter } from "vue-router";
import { ref, toRefs, watch, nextTick } from "vue";
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
    const hasShowMore = ref(false);
    const finalSimilarArtists = ref([]);

    //watch
    watch(
      similarArtists,
      (newVal) => {
        finalSimilarArtists.value = newVal.slice(0, 12);
      },
      { immediate: true }
    );

    // methods
    // 1.展开、折叠方法
    const showMore = async () => {
      finalSimilarArtists.value = similarArtists.value;
      hasShowMore.value = true;
      await nextTick();
      similarArtistSectionRef.value.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };
    const fold = () => {
      finalSimilarArtists.value = similarArtists.value.slice(0, 12);
      hasShowMore.value = false;
      similarArtistSectionRef.value.scrollIntoView({
        block: "end",
      });
    };
    // 2.跳转到专辑页面
    const toArtistView = (artistId) => {
      router.push(`/artist/${artistId}`);
    };

    return {
      // data
      similarArtistSectionRef,
      similarArtists,
      finalSimilarArtists,
      hasShowMore,
      // methods
      showMore,
      fold,
      toArtistView,
      playAllSongOfArtist,
    };
  },
};
</script>

<style lang='scss' scoped>
.similarartistsection {
  @include not-allowed-select;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 20px;
    height: 50px;
    .title {
      font-size: 22px;
      font-weight: 700;
    }
    .showmoreBtn {
      color: #888;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      &:hover {
        color: #666;
      }
    }
  }
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
  .foldBtn {
    color: #888;
    text-align: right;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    &:hover {
      color: #666;
    }
  }
}
</style>