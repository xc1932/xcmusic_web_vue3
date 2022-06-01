<template>
  <div class="SearchDetailView">
    <div class="container center">
      <div class="header">{{ typeDesc }}&nbsp;{{ keywords }}&nbsp;搜索结果</div>
      <div class="searchResBody">
        <div class="songSection" v-if="type === 1">
          <song-show-list :songlist="result.datalist"></song-show-list>
        </div>
        <div class="albumSection" v-if="type === 10">
          <album-show-list :albumlist="result.datalist"></album-show-list>
        </div>
        <div class="artistSection" v-if="type === 100">
          <artist-show-list
            :similarArtists="result.datalist"
          ></artist-show-list>
        </div>
        <div class="playlistSection" v-if="type === 1000">
          <playlist-show-list :playlists="result.datalist"></playlist-show-list>
        </div>
        <div class="mvSection" v-if="type === 1004">
          <mv-show-list :mvlist="result.datalist"></mv-show-list>
        </div>
      </div>
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
import ArtistShowList from "@/components/artist-show-list/ArtistShowList.vue";
import MvShowList from "@/components/mv-show-list/MvShowList.vue";
import PlaylistShowList from "@/components/playlist-show-list/PlaylistShowList.vue";
import AlbumShowList from "@/components/album-show-list/AlbumShowList.vue";
import SongShowList from "@/components/song-show-list/SongShowList.vue";
import * as moment from "moment";
import { timeTransform } from "@/utils/utils";
import { getSongDetail } from "@/api/song";
import { getSearchResult } from "@/api/search";
import { useRoute } from "vue-router";
import { ref } from "vue";
export default {
  name: "SearchDetailView",
  components: {
    SongShowList,
    AlbumShowList,
    PlaylistShowList,
    MvShowList,
    ArtistShowList,
  },
  setup() {
    // vue-router
    const route = useRoute();
    const { keywords } = route.params;
    const type = route.params.type * 1;
    // data
    const result = ref({});
    const typeDesc =
      type === 1
        ? "单曲"
        : type === 10
        ? "专辑"
        : type === 100
        ? "歌手"
        : type === 1000
        ? "歌单"
        : type === 1004
        ? "MV"
        : "";

    // methods
    const initData = () => {
      // type: 1：单曲  10：专辑  100：歌手  1000：歌单  1004：MV
      getSearchResult({ keywords, type }).then((res) => {
        if (res.code === 200) {
          const data = res.result;
          dataConvert(data);
        }
      });
    };

    const dataConvert = (data) => {
      if (type === 1) {
        result.value.hasMore = data.hasMore;
        const ids = data.songs.map((s) => s.id).join(",");
        getSongDetail({ ids }).then((res) => {
          if (res.code === 200) {
            const newSonglist = res.songs.map((s) => {
              return {
                id: s.id,
                songName: s.name,
                albumId: s.al.id,
                albumName: s.al.name,
                imgUrl: s.al.picUrl,
                artistArr: s.ar.map((a) => {
                  return {
                    artistId: a.id,
                    artistName: a.name,
                  };
                }),
                playable: {
                  playable: true,
                  reason: "",
                },
              };
            });
            result.value.datalist === undefined
              ? (result.value.datalist = newSonglist)
              : (result.value.datalist =
                  result.value.datalist.concat(newSonglist));
          }
        });
      } else if (type === 10) {
        const newAlbumlist = data.albums.map((a) => {
          return {
            id: a.id,
            albumCover: a.picUrl,
            albumName: a.name,
            albumType: a.type,
            albumPublishTime: moment(a.publishTime).format("YYYY年MM月DD日"),
            size: a.size,
          };
        });
        result.value.datalist === undefined
          ? (result.value.datalist = newAlbumlist)
          : (result.value.datalist =
              result.value.datalist.concat(newAlbumlist));
        result.value.hasMore = result.value.datalist.length < data.albumCount;
      } else if (type === 100) {
        result.value.hasMore = data.hasMore;
        const newArtistlist = data.artists.map((a) => {
          return {
            id: a.id,
            artistName: a.name,
            artistAvatar: a.picUrl,
          };
        });
        result.value.datalist === undefined
          ? (result.value.datalist = newArtistlist)
          : (result.value.datalist =
              result.value.datalist.concat(newArtistlist));
      } else if (type === 1000) {
        result.value.hasMore = data.hasMore;
        const newPlaylists = data.playlists.map((p) => {
          return {
            id: p.id,
            playlistName: p.name,
            playlistCover: p.coverImgUrl,
            trackCount: p.trackCount,
          };
        });
        result.value.datalist === undefined
          ? (result.value.datalist = newPlaylists)
          : (result.value.datalist =
              result.value.datalist.concat(newPlaylists));
      } else if (type === 1004) {
        const newMvlist = data.mvs.map((m) => {
          return {
            id: m.id,
            mvName: m.name,
            mvCover: m.cover,
            mvPublishTime: timeTransform(m.duration),
          };
        });
        result.value.datalist === undefined
          ? (result.value.datalist = newMvlist)
          : (result.value.datalist = result.value.datalist.concat(newMvlist));
        result.value.hasMore = result.value.datalist.length < data.mvCount;
      }
    };

    // 加载更多
    const loadMore = () => {
      if (!result.value.datalist) return;
      // type: 1：单曲  10：专辑  100：歌手  1000：歌单  1004：MV
      getSearchResult({
        keywords,
        type,
        offset: result.value.datalist.length,
      }).then((res) => {
        if (res.code === 200) {
          const data = res.result;
          dataConvert(data);
        }
      });
    };

    initData();
    return {
      // vue-router
      keywords,
      type,
      // data
      typeDesc,
      result,
      // methods
      loadMore,
    };
  },
};
</script>

<style lang='scss' scoped>
.SearchDetailView {
  position: fixed;
  top: 0;
  left: 0;
  margin: 75px auto 0;
  padding-bottom: 90px;
  width: 100%;
  height: calc(100% - 100px);
  background-color: #fff;
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