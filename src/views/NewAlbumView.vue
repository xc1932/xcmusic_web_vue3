<template>
  <div class="NewAlbumView">
    <div class="container center">
      <div class="header">新专速递</div>
      <album-show-list :albumlist="result.albumList"></album-show-list>
      <div
        class="loadMoreBtn"
        v-clickZoomOut:[0.95]
        @click.stop="loadMore"
        v-if="result.hasMore"
      >
        加载更多
      </div>
    </div>
  </div>
</template>

<script>
import * as moment from "moment";
import AlbumShowList from "@/components/album-show-list/AlbumShowList.vue";
import { getNewAlbums } from "@/api/album";
import { ref } from "vue";
export default {
  name: "NewAlbumView",
  components: { AlbumShowList },
  setup() {
    // data
    const result = ref({});

    // methods
    // 获取新专辑
    const loadMore = () => {
      let offset = 0;
      if (result.value.albumList) offset = result.value.albumList.length;
      getNewAlbums({ offset }).then((res) => {
        if (res.code === 200) {
          const newAlbumlist = res.albums.map((a) => {
            return {
              id: a.id,
              albumCover: a.picUrl,
              albumName: a.name,
              albumType: a.type,
              albumPublishTime: a.publishTime,
              size: a.size,
            };
          });
          result.value.albumList === undefined
            ? (result.value.albumList = newAlbumlist)
            : (result.value.albumList =
                result.value.albumList.concat(newAlbumlist));
          result.value.hasMore = result.value.albumList.length < res.total;
        }
      });
    };

    loadMore();
    return {
      // data
      result,
      // methods
      loadMore,
    };
  },
};
</script>

<style lang='scss' scoped>
.NewAlbumView {
  margin: 75px auto 0;
  padding-bottom: 90px;
  height: calc(100% - 100px);
  overflow: auto;
  .header {
    height: 70px;
    line-height: 70px;
    font-size: 32px;
    font-weight: 700;
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