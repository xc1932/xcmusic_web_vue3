<template>
  <div class="home-container">
    <banner :banners="banners" v-if="banners.length > 0" />
    <hot-recommend :songlist="songlist" />
    <div class="foryou container center">
      <daily-recommend :dailySongs="dailySongs"></daily-recommend>
      <private-fm></private-fm>
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
import { getBanner } from "@/api/others";
import {
  getRecommendSonglist,
  getDailyRecommendSongs,
  getTopList,
} from "@/api/songlist";
import PrivateFm from "@/components/private-fm/PrivateFm.vue";
import DailyRecommend from "@/components/dailyrecommend/DailyRecommend";
import Toplist from "@/components/toplist/Toplist";
import AlbumRecommend from "@/components/albumrecommend/AlbumRecommend";
import ArtistRecommend from "@/components/artistrecommend/ArtistRecommend";
import HotRecommend from "@/components/hotrecommend/HotRecommend";
import Banner from "@/components/banner/Banner.vue";
import { useStore } from "vuex";
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
    PrivateFm,
  },
  setup() {
    // vuex
    const store = useStore();

    // data
    const banners = ref([]);
    const songlist = ref([]);
    const artistList = ref([]);
    const albumList = ref([]);
    const toplist = ref([]);
    const dailySongs = ref([]);

    // init(loaddata)
    // 1.获取banner
    getBanner({
      type: 0,
    }).then((res) => {
      if (res.code === 200) {
        banners.value = res.banners;
        // console.log(res.banners);
      }
    });
    // 2.获取推荐歌曲
    getRecommendSonglist({ limit: 10 }).then((res) => {
      if (res.code === 200) {
        songlist.value = res.result;
      }
    });
    // 3.获取推荐歌手
    getArtistToplist().then((res) => {
      if (res.code === 200) {
        const artists = res.list.artists;
        createRandomIndexArr(24).forEach((randomIndex) => {
          artistList.value.push(artists[randomIndex]);
        });
      }
    });
    // 4.获取新专辑
    getNewAlbums({
      limit: 10,
    }).then((res) => {
      if (res.code === 200) {
        albumList.value = res.albums;
      }
    });
    // 5.获取所有排行榜
    getTopList().then((res) => {
      if (res.code === 200) {
        toplist.value = res.list.slice(0, 5);
      }
    });
    // 6.获取每日推荐歌曲
    getDailyRecommendSongs().then((res) => {
      if (res.code === 200) {
        dailySongs.value = res.data.dailySongs;
      }
    });
   

    return {
      // data
      banners,
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
  margin: 75px auto 0;
  padding-bottom: 90px;
  height: calc(100% - 100px);
  overflow: auto;
  .foryou {
    display: flex;
    justify-content: space-between;
  }
}
</style>