<template>
  <div class="hotrecommend container center">
    <div class="rec-header">
      <div class="left">新专速递</div>
      <div class="right">查看全部</div>
    </div>
    <div class="rec-body">
      <rectangle-show-box
        v-for="item in albums"
        :key="item.id"
        :imgUrl="item.picUrl"
        imgHeight="225px"
        boxWidth="225px"
        boxHeight="300px"
        imgRadius="15px"
        @playbtnClick="playAllSongInAlbum(item)"
        @click="toAlbumView(item.id)"
      >
        <div class="description">
          {{ item.name }}
        </div>
        <div class="other">
          <span>{{item.artist.name}}</span>
        </div>
      </rectangle-show-box>
    </div>
  </div>
</template>

<script>
import RectangleShowBox from "@/components/base/RectangleShowBox";
import useHomeViewControls from '@/views/hooks/useHomeViewControls'
import {useRouter} from 'vue-router'
export default {
  name: "AlbumRecommend",
  components: { RectangleShowBox },
  props:{
    albums:{
      type:Array,
      default:[]
    }
  },
  setup() {     
    // router
    const router=useRouter()

    // hooks
    const {playAllSongInAlbum}=useHomeViewControls()

    // methods
    const toAlbumView=(id)=>{
      router.push(`/album/${id}`)
    }
    return {
      // hooks
      playAllSongInAlbum,
      // methods
      toAlbumView
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
    .other{
      .right{
        float: right;
        padding-right: 3px;
      }
    }
  }
}
</style>