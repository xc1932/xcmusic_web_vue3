<template>
  <div class="hotrecommend container center">
    <div class="rec-header">
      <div class="left">排行榜</div>
      <div class="right">查看全部</div>
    </div>
    <div class="rec-body">
      <rectangle-show-box
        v-for="item in toplist"
        :key="item.id"
        :imgUrl="item.coverImgUrl"
        imgHeight="225px"
        boxWidth="225px"
        boxHeight="300px"
        imgRadius="15px"
        @playbtnClick="playAllSongInPlaylist(item)"
        @click="toPlaylistView(item.id)"
      >
        <div class="description">
          {{ item.name }}
        </div>
        <div class="other">
          <span>{{ item.updateFrequency }}</span>
        </div>
      </rectangle-show-box>
    </div>
  </div>
</template>

<script>
import RectangleShowBox from "@/components/base/RectangleShowBox";
import useHomeViewControls from "@/views/hooks/useHomeViewControls";
import { useRouter } from "vue-router";
export default {
  name: "Toplist",
  components: { RectangleShowBox },
  props: {
    toplist: {
      type: Array,
      default: [],
    },
  },
  setup() {
    // router
    const router = useRouter();
    // hooks
    const { playAllSongInPlaylist } = useHomeViewControls();

    // 跳转到playlist页面
    const toPlaylistView = (id) => {
      router.push(`/playlist/${id}`);
    };
    return {
      // hooks
      playAllSongInPlaylist,
      // methods
      toPlaylistView,
    };
  },
};
</script>

<style lang="scss" scoped>
.hotrecommend {
  margin-bottom: $margin-bottom;
  display: flex;
  flex-direction: column;
  .rec-header {
    height: 45px;
    line-height: 45px;
    display: flex;
    justify-content: space-between;
    .left {
      font-size: $font-size-large-x;
      font-weight: $font-weight-large-x;
    }
    .right {
      font-size: $font-size-small;
      font-weight: 900;
    }
  }
  .rec-body {
    height: 300px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    .description {
      width: 100%;
      height: 22px;
      margin-top: 10px;
      @include text-overflow-hidden(1);
      font-weight: 700;
    }
    .other {
      font-size: $font-size-small-s;
    }
  }
}
</style>