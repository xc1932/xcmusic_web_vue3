<template>
  <div class="ExploreView">
    <div class="container center">
      <div class="header">
        <div class="selectedCat">
          <div
            class="allCat"
            v-clickZoomOut
            :class="{ selected: selectedCat === '全部' }"
            @click.stop="selectCat('全部')"
          >
            全部
          </div>
          <div
            class="recommendPlaylist"
            v-clickZoomOut
            :class="{ selected: selectedCat === '推荐' }"
            @click.stop="selectCat('推荐')"
          >
            推荐歌单
          </div>
          <div
            class="HighQualityPlaylist"
            v-clickZoomOut
            :class="{ selected: selectedCat === '精品' }"
            @click.stop="selectCat('精品')"
          >
            精品歌单
          </div>
          <div
            class="offical"
            v-clickZoomOut
            :class="{ selected: selectedCat === '官方' }"
            @click.stop="selectCat('官方')"
          >
            官方
          </div>
          <div
            class="toplist"
            v-clickZoomOut
            :class="{ selected: selectedCat === '排行榜' }"
            @click.stop="selectCat('排行榜')"
          >
            排行榜
          </div>
          <div
            class="cat"
            v-for="cat in selectedCategories"
            :key="cat"
            v-clickZoomOut
            :class="{ selected: selectedCat === cat }"
            @click.stop="selectCat(cat)"
          >
            {{ cat }}
          </div>
          <div
            class="moreCat"
            v-clickZoomOut
            :class="{ selected: showCategoryPanel }"
            v-if="categoryObj"
            @click.stop="showMoreCategory"
          >
            ···
          </div>
        </div>
        <category-panel
          :categoryObj="categoryObj"
          v-if="showCategoryPanel"
        ></category-panel>
      </div>
      <div class="body">
        <playlist-show-list
          :playlists="playlistData.playlists"
        ></playlist-show-list>
      </div>
      <div
        class="loadMoreBtn"
        v-clickZoomOut:[0.95]
        @click.stop="loadMore"
        v-if="playlistData.hasMore"
      >
        加载更多
      </div>
    </div>
  </div>
</template>

<script>
import PlaylistShowList from "@/components/playlist-show-list/PlaylistShowList.vue";
import CategoryPanel from "@/components/CategoryPanel/CategoryPanel.vue";
import useExploreViewControls from "./hooks/useExploreViewControls";
export default {
  name: "ExploreView",
  components: { CategoryPanel, PlaylistShowList },
  setup() {
    // hooks
    const {
      categoryObj,
      selectedCategories,
      selectedCat,
      showCategoryPanel,
      playlistData,
      selectCat,
      showMoreCategory,
      loadMore
    } = useExploreViewControls();

    return {
      // hooks
      categoryObj,
      selectedCat,
      selectedCategories,
      showCategoryPanel,
      playlistData,
      selectCat,
      showMoreCategory,
      loadMore
    };
  },
};
</script>

<style lang='scss' scoped>
.ExploreView {
  margin: 75px auto 0;
  padding-bottom: 90px;
  height: calc(100% - 100px);
  overflow: scroll;
  .header {
    margin-bottom: 20px;
    .selectedCat {
      display: flex;
      flex-wrap: wrap;
      padding: 15px 0;
      @include not-allowed-select;
      .selected {
        color: #3359d4;
      }
      div {
        margin: 0 15px 15px 0;
        padding: 5px 15px;
        border-radius: 10px;
        background-color: #eee;
        font-size: 22px;
        font-weight: 700;
        &:hover {
          color: #3359d4;
          cursor: pointer;
        }
      }
    }
  }
  .loadMoreBtn {
    margin: 0 auto;
    width: 150px;
    height: 50px;
    line-height: 50px;
    border-radius: 15px;
    background-color: #eee;
    font-size: 22px;
    font-weight: 700;
    text-align: center;
    @include not-allowed-select;
  }
}
</style>