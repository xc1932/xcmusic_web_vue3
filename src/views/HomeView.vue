<template>
  <div class="home-container">
    <banner />
    <hot-recommend :songlist="songlist" />
    <div class="foryou container center">
      <daily-recommend :dailySongs="dailySongs"></daily-recommend>
      <daily-recommend :dailySongs="dailySongs"></daily-recommend>
    </div>
    <artist-recommend :artists="artistList" />
    <album-recommend :albums="albumList"></album-recommend>
    <toplist :toplist="toplist"></toplist>
  </div>
</template>

<script>
import { createRandomIndexArr } from "@/utils/utils";
import { getArtistToplist } from "@/api/artist";
import { getNewAlbums } from "@/api/album";
import { getTopList } from "@/api/songlist";
import { getRecommendSonglist, getDailyRecommendSongs } from "@/api/songlist";
import DailyRecommend from "@/components/dailyrecommend/DailyRecommend";
import Toplist from "@/components/toplist/Toplist";
import AlbumRecommend from "@/components/albumrecommend/AlbumRecommend";
import ArtistRecommend from "@/components/artistrecommend/ArtistRecommend";
import HotRecommend from "@/components/hotrecommend/HotRecommend";
import Banner from "@/components/banner/Banner.vue";
import {useStore} from 'vuex'
import { ref } from "vue";
export default {
  name: "HomeView",
  components: {
    Banner,
    HotRecommend,
    ArtistRecommend,
    AlbumRecommend,
    Toplist,
    DailyRecommend,
  },
  setup() {
    const songlist = ref([]);
    const artistList = ref([]);
    const albumList = ref([]);
    const toplist = ref([]);
    const dailySongs = ref([]);
    const store=new useStore()

    // 获取songlist
    getRecommendSonglist({ limit: 10 }).then((res) => {
      if (res.code === 200) {
        songlist.value = res.result;
      }
    });

    // 获取推荐歌手
    getArtistToplist().then((res) => {
      if (res.code === 200) {
        const artists = res.list.artists;
        createRandomIndexArr(24).forEach((randomIndex) => {
          artistList.value.push(artists[randomIndex]);
        });
      }
    });
    // 获取新专辑
    getNewAlbums({
      limit: 10,
    }).then((res) => {
      if (res.code === 200) {
        albumList.value = res.albums;
      }
    });
    // 获取每日推荐歌曲
    getDailyRecommendSongs().then((res) => {
      if (res.code === 200) {
        dailySongs.value = res.data.dailySongs;

        // $$ 临时测试 $$
        const dailySongsIds=res.data.dailySongs.map(item=>item.id)
        store.dispatch('setPlayerPlayList',dailySongsIds)
      }
    });

    // 获取所有排行榜
    getTopList().then((res) => {
      if (res.code === 200) {
        toplist.value = res.list.slice(0, 5);
      }
    });
    return {
      songlist,
      artistList,
      albumList,
      toplist,
      dailySongs,
    };
  },
};
</script>

<style lang='scss' scoped>
.home-container {
  padding-top: 75px;
  .foryou {
    display: flex;
    justify-content: space-between;
  }
}
</style>