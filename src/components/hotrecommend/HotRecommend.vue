<template>
  <div class="hotrecommend container center">
    <div class="rec-header">
      <div class="left">推荐歌曲</div>
      <div class="right" @click.stop="toExploreView">查看全部</div>
    </div>
    <div class="rec-body">
      <rectangle-show-box
        v-for="item in songlist"
        :key="item.id"
        :imgUrl="item.picUrl"
        imgHeight="225px"
        boxWidth="225px"
        boxHeight="300px"
        imgRadius="15px"
        :trackCount="item.trackCount"
        :copyWriter="item.copywriter"
        @playbtnClick="playAllSongInPlaylist(item)"
        @click="toPlaylistView(item.id)"
      >
        <div class="description">
          {{ item.name }}
        </div>
        <div class="other">
          <span>播放量：{{ playCountConvert(item.playCount) }}</span>
          <span class="right">{{
            createTime(item.trackNumberUpdateTime)
          }}</span>
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
  name: "HotRecommend",
  components: { RectangleShowBox },
  props: {
    songlist: {
      type: Array,
      default: [],
    },
  },
  setup() {
    // router
    const router = useRouter();
    // hooks
    const { playAllSongInPlaylist } = useHomeViewControls();
    // methods
    // 播放量转换函数
    const playCountConvert = (playCount) => {
      return playCount > 10000
        ? (playCount / 10000).toFixed(1) + "万"
        : playCount;
    };
    // 创建时间
    const createTime = (updateTime) => {
      const time = new Date(updateTime);
      return `${time.getFullYear()}-${time.getMonth()}-${time.getDate()}`;
    };
    // 跳转到playlist页面
    const toPlaylistView = (id) => {
      router.push(`/playlist/${id}`);
    };
    // 跳转到发现页面
    const toExploreView = () => {
      router.push({ path: `/explore`, query: { cat: "推荐" } });
    };
    return {
      // hooks
      playAllSongInPlaylist,
      // methods
      playCountConvert,
      createTime,
      toPlaylistView,
      toExploreView,
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
      cursor: pointer;
    }
  }
  .rec-body {
    height: 600px;
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
      .right {
        float: right;
        padding-right: 3px;
      }
    }
  }
}
</style>