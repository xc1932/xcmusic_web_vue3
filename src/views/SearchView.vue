<template>
  <div class="searchview">
    <div class="container center">
      <div class="songSection" v-if="songs">
        <div class="header">
          <div class="title">歌曲</div>
          <div class="showAll" v-if="songs.hasMore">查看全部</div>
        </div>
        <song-show-section :songlist="songs.songlist"></song-show-section>
      </div>
      <div class="playlistSection" v-if="playlists">
        <div class="header">
          <div class="title">歌单</div>
          <div class="showAll" v-if="playlists.hasMore">查看全部</div>
        </div>
        <playlist-show-section
          :playlists="playlists.playlists"
        ></playlist-show-section>
      </div>
      <div class="artistSection" v-if="artists">
        <div class="header">
          <div class="title">艺人</div>
          <div class="showAll" v-if="artists.hasMore">查看全部</div>
        </div>
        <similar-artist-section
          :similarArtists="artists.artistlist"
        ></similar-artist-section>
      </div>
      <div class="albumSection" v-if="albums">
        <div class="header">
          <div class="title">专辑</div>
          <div class="showAll" v-if="albums.hasMore">查看全部</div>
        </div>
        <album-show-section :albumlist="albums.albumlist"></album-show-section>
      </div>
      <div class="mvSection" v-if="mvs">
        <div class="header">
          <div class="title">MV</div>
          <div class="showAll" v-if="mvs.hasMore">查看全部</div>
        </div>
        <mv-show-section :mvlist="mvs.mvlist"></mv-show-section>
      </div>
    </div>
  </div>
</template>

<script>
import * as moment from "moment";
import { timeTransform } from "@/utils/utils";
import PlaylistShowSection from "@/components/playlist-show-section/PlaylistShowSection.vue";
import SimilarArtistSection from "@/components/similar-artist-section/SimilarArtistSection.vue";
import MvShowSection from "@/components/mv-show-section/MvShowSection.vue";
import SongShowSection from "@/components/song-show-section/SongShowSection.vue";
import AlbumShowSection from "@/components/album-show-section/AlbumShowSection.vue";
import { getSongDetail } from "@/api/song";
import { getSearchResult } from "@/api/search";
import { useRouter } from "vue-router";
import { ref } from "vue";
export default {
  name: "SearchView",
  components: {
    SimilarArtistSection,
    MvShowSection,
    SongShowSection,
    AlbumShowSection,
    PlaylistShowSection,
  },
  props: ["keywords"],
  setup(props) {
    moment.suppressDeprecationWarnings = true;
    // vue-router
    const router = useRouter();
    // data
    const { keywords } = props;
    const songs = ref(null);
    const albums = ref(null);
    const artists = ref(null);
    const playlists = ref(null);
    const mvs = ref(null);

    // methods
    // 获取搜索结果
    const initData = () => {
      // type: 1：单曲  10：专辑  100：歌手  1000：歌单  1004：MV
      // 获取搜索单曲结果
      getSearchResult({ keywords, limit: 12, type: 1 }).then((res) => {
        if (res.code === 200) {
          songs.value = {};
          const data = res.result;
          songs.value.hasMore = data.hasMore;
          const ids = data.songs.map((s) => s.id).join(",");
          getSongDetail({ ids }).then((res2) => {
            if (res2.code === 200) {
              songs.value.songlist = res2.songs.map((s) => {
                return {
                  id: s.id,
                  hsName: s.name,
                  hsAlbumId: s.al.id,
                  hsAlbumCover: s.al.picUrl,
                  hsAlbumName: s.al.name,
                };
              });
            }
          });
        }
      });
      // 获取专辑搜索结果
      getSearchResult({ keywords, limit: 12, type: 10 }).then((res) => {
        if (res.code === 200) {
          albums.value = {};
          const data = res.result;
          albums.value.hasMore = data.albumCount > 12;
          albums.value.albumlist = data.albums.map((a) => {
            return {
              id: a.id,
              albumCover: a.picUrl,
              albumName: a.name,
              albumType: a.type,
              albumPublishTime: moment(a.publishTime).format("YYYY年MM月DD日"),
              size: a.size,
            };
          });
        }
      });
      // 获取歌手搜索结果
      getSearchResult({ keywords, limit: 16, type: 100 }).then((res) => {
        if (res.code === 200) {
          artists.value = {};
          const data = res.result;
          artists.value.hasMore = data.hasMore;
          artists.value.artistlist = data.artists.map((a) => {
            return {
              id: a.id,
              artistName: a.name,
              artistAvatar: a.picUrl,
            };
          });
        }
      });
      // 获取播放列表搜索结果
      getSearchResult({ keywords, limit: 10, type: 1000 }).then((res) => {
        if (res.code === 200) {
          playlists.value = {};
          const data = res.result;
          playlists.value.hasMore = data.hasMore;
          playlists.value.playlists = data.playlists.map((p) => {
            return {
              id: p.id,
              playlistName: p.name,
              playlistCover: p.coverImgUrl,
              trackCount: p.trackCount,
            };
          });
        }
      });
      // 获取mv搜索结果
      getSearchResult({ keywords, limit: 10, type: 1004 }).then((res) => {
        if (res.code === 200) {
          mvs.value = {};
          const data = res.result;
          mvs.value.hasMore = data.mvCount > 10;
          mvs.value.mvlist = data.mvs.map((m) => {
            return {
              id: m.id,
              mvName: m.name,
              mvCover: m.cover,
              mvPublishTime: timeTransform(m.duration),
            };
          });
        }
      });
    };

    initData();

    return {
      // data
      songs,
      albums,
      artists,
      playlists,
      mvs,
    };
  },
};
</script>

<style lang='scss' scoped>
.searchview {
  margin: 75px auto 0;
  padding-bottom: 90px;
  height: calc(100% - 100px);
  overflow: auto;
  .songSection,
  .playlistSection,
  .artistSection,
  .albumSection,
  .mvSection {
    margin-top: 20px;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 15px;
      height: 30px;
      .title {
        font-size: 22px;
        font-weight: 700;
      }
      .showAll {
        font-size: 14px;
        font-weight: 700;
        color: #666;
        cursor: pointer;
      }
    }
  }
}
</style>