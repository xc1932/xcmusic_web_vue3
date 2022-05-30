<template>
  <div class="albumview">
    <div class="container center">
      <!-- 专辑信息展示区域 -->
      <info-show-section
        v-show="albumInfo"
        :imgUrl="albumInfo?.picUrl"
        :title="albumInfo?.name"
        :desc="albumInfo?.description"
        :focus="focus"
        @playbtnClick="playbtnClick"
        @focusbtnClick="focusbtnClick"
      >
        <div class="creator">
          <img
            v-lazy="albumInfo?.artist?.picUrl"
            @click.stop="toArtistView(albumInfo?.artist.id)"
          />
          <span
            >{{ albumInfo?.type }} by
            <span
              class="name"
              @click.stop="toArtistView(albumInfo?.artist.id)"
              >{{ albumInfo?.artist.name }}</span
            ></span
          >
        </div>
        <div class="info textoverflow-hidden-single">
          <span v-if="albumInfo?.size">{{ albumInfo?.size }}首歌</span>
          <span v-if="albumInfo?.publishTime">
            · {{ moment(albumInfo?.publishTime).format("YYYY年MM月DD日") }}
          </span>
          <span v-if="albumInfo?.company"> · {{ albumInfo?.company }} </span>
        </div>
      </info-show-section>
      <!-- 专辑音乐列表区域 -->
      <song-play-list
        :songlist="songlistData"
        :currentId="curSong.id"
        @playAllMusicInAlbum="playAllMusicInAlbum"
      ></song-play-list>
      <!-- 分割线 -->
      <div class="line"></div>
      <!-- 歌手其他专辑展示区域 -->
      <album-show-section
        :albumlist="albumlistData"
        :title="'More by ' + albumInfo?.artist.name"
      ></album-show-section>
    </div>
  </div>
</template>

<script>
import * as moment from "moment";
import { getArtistAlbum } from "@/api/artist";
import { getAlbumDetail, subscribeAlbum } from "@/api/album";
import { timeTransform } from "@/utils/utils";
import { messagebox } from "@/utils/customComponent";
import useHomeViewControls from "@/views/hooks/useHomeViewControls";
import AlbumShowSection from "@/components/album-show-section/AlbumShowSection.vue";
import InfoShowSection from "@/components/info-show-section/InfoShowSection.vue";
import SongPlayList from "@/components/song-play-list/SongPlayList.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, computed, watch } from "vue";
export default {
  name: "AlbumView",
  components: { InfoShowSection, SongPlayList, AlbumShowSection },
  props: ["id"],
  setup(props) {
    // router
    const router = useRouter();

    // data
    const id = props.id;
    const completeSongData = ref([]);
    const albumInfo = ref(null);
    const songlistData = ref([]);
    const albumlistData = ref([]);

    // vuex
    const store = useStore();
    const userLikedAlbums = computed(() =>
      store.getters.getLikedAlbums.map((a) => a.id)
    );
    const focus = computed(() =>
      userLikedAlbums.value.includes(albumInfo.value?.id)
    );
    const playList = computed(() => store.getters.getPlayList);
    const shuffledList = computed(() => store.getters.getShuffledList);
    const playMode = computed(() => store.getters.getPlayMode);
    const curSong = computed(() => store.getters.getCurSong);

    // init data(获取专辑信息)
    getAlbumDetail({ id }).then((res) => {
      let idsArr = [];
      if (res.code === 200) {
        albumInfo.value = res.album;
        // 获取歌手的更多专辑
        getArtistAlbum({ id: res.album?.artist.id }).then((res2) => {
          if (res2.code === 200) {
            fillAlbumlistData(res2.hotAlbums);
          }
        });
        // 获取歌曲的完整信息
        idsArr = res.songs.map((s) => s.id);
        if (idsArr.length === 0) {
          messagebox.warn("没有歌曲");
        } else {
          accessCompleteDataOfSongs(idsArr, completeSongData);
        }
      } else {
        messagebox.warn("获取专辑失败");
      }
    });

    // hooks
    const { accessCompleteDataOfSongs } = useHomeViewControls();

    // methods
    // 1.填充歌曲列表数据
    watch(completeSongData, (newVal) => {
      songlistData.value = newVal.map((s) => {
        const songInfo = s.detail.songInfo;
        return {
          songId: s.id,
          songName: songInfo.name,
          albumName: songInfo.al.name,
          albumId: songInfo.al.id,
          imgUrl: songInfo.al.picUrl,
          time: timeTransform(songInfo.dt),
          playable: s.playable,
          artistArr: songInfo.ar.map((a) => ({
            artistName: a.name,
            artistId: a.id,
          })),
        };
      });
    });

    // 2.填充专辑列表数据
    const fillAlbumlistData = (rawData) => {
      albumlistData.value = rawData.map((s) => ({
        id: s.id,
        albumCover: s.picUrl,
        albumName: s.name,
        albumType: s.type,
        albumPublishTime: s.publishTime,
        size: s.size,
      }));
    };

    // 2.点击播放全部歌曲
    const playbtnClick = () => {
      store.dispatch("setPlayerPlaylistOnly", completeSongData.value);
    };

    // 3.点击收藏歌单
    const focusbtnClick = () => {
      let t = 1;
      if (focus.value) {
        t = 2;
      }
      subscribeAlbum({ t, id: albumInfo.value.id }).then((res) => {
        if (res.code === 200) {
          // 重新拉取数据
          if (t === 1) {
            messagebox.success("收藏成功");
          } else {
            messagebox.success("取消收藏成功");
          }
          store.dispatch("setLikedAlbums");
        } else {
          if (t === 1) {
            messagebox.warn("收藏失败");
          } else {
            messagebox.warn("取消收藏失败");
          }
        }
      });
    };

    // 4.点击音乐列表播放歌曲
    const playAllMusicInAlbum = (currentSongId) => {
      if (completeSongData.value !== playList.value) {
        playbtnClick();
      }
      let index = -1;
      if (playMode.value === 2) {
        index = shuffledList.value.findIndex((s) => s.id === currentSongId);
      } else {
        index = playList.value.findIndex((s) => s.id === currentSongId);
      }
      if (index !== -1) {
        store.dispatch("setPlayerCurrentIndex", index);
      }
    };

    // 5.跳转到歌手页面
    const toArtistView = (artistId) => {
      router.push(`/artist/${artistId}`);
    };
    return {
      // data
      completeSongData,
      albumInfo,
      songlistData,
      albumlistData,
      // vuex
      curSong,
      userLikedAlbums,
      focus,
      // methods
      moment,
      playbtnClick,
      focusbtnClick,
      playAllMusicInAlbum,
      toArtistView,
    };
  },
};
</script>

<style lang='scss' scoped>
.albumview {
  margin: 75px auto 0;
  padding-bottom: 90px;
  height: calc(100% - 100px);
  overflow: auto;
  .creator {
    display: flex;
    align-items: flex-end;
    margin: 10px 0;
    font-weight: 700;
    span {
      .name {
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    img {
      margin-right: 6px;
      width: 40px;
      height: 40px;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  .line {
    line-height: 50px;
    margin: 30px 0 10px 0;
    border-top: 1px solid #eee;
    font-size: 22px;
    font-weight: 700;
  }
}
</style>