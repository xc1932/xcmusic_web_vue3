<template>
  <div class="playlistview">
    <div class="container center">
      <info-show-section
        v-show="playlistInfo"
        :imgUrl="playlistInfo?.coverImgUrl"
        :title="playlistInfo?.name"
        :desc="playlistInfo?.description"
        :focus="focus"
        @playbtnClick="playbtnClick"
        @focusbtnClick="focusbtnClick"
      >
        <div class="creator" v-show="playlistInfo?.creator">
          <img v-lazy="playlistInfo?.creator?.avatarUrl" />
          {{ playlistInfo?.creator.nickname }}
        </div>
        <div class="info textoverflow-hidden-single">
          最后更新于
          {{ moment(playlistInfo?.updateTime).format("YYYY年MM月DD日") }} ·
          {{ playlistInfo?.trackCount }}首歌
        </div>
      </info-show-section>
      <song-show-list :songlist="songlistData"></song-show-list>
    </div>
  </div>
</template>

<script>
import * as moment from "moment";
import { getPlaylistDetail, subscribePlaylist } from "@/api/songlist";
import { timeTransform } from "@/utils/utils";
import { messagebox } from "@/utils/customComponent";
import useHomeViewControls from "@/views/hooks/useHomeViewControls";
import InfoShowSection from "@/components/info-show-section/InfoShowSection.vue";
import SongShowList from "@/components/song-show-list/SongShowList.vue";
import { useStore } from "vuex";
import { ref, computed, watch } from "vue";
export default {
  name: "PlaylistView",
  components: { SongShowList, InfoShowSection },
  props: ["id"],
  setup(props) {
    // data
    const id = props.id;
    const completeSongsDataArr = ref([]);
    const playlistInfo = ref(null);
    const songlistData = ref([]);

    // vuex
    const store = useStore();
    const userId = computed(() => store.getters.getUserID);
    const userLikedPlaylist = computed(() =>
      store.getters.getLikedPlaylists.map((p) => p.id)
    );
    const focus = computed(() =>
      userLikedPlaylist.value.includes(playlistInfo.value?.id)
    );

    // initData
    getPlaylistDetail({ id }).then((res) => {
      let idsArr = [];
      if (res.code === 200) {
        playlistInfo.value = res.playlist;
        idsArr = res.playlist.trackIds.map((t) => t.id);
        if (idsArr.length === 0) {
          messagebox.warn("没有歌曲");
        } else {
          accessCompleteDataOfSongs(idsArr, completeSongsDataArr);
        }
      } else {
        messagebox.warn("获取歌单失败");
      }
    });

    // watch
    // 填充音乐列表
    watch(completeSongsDataArr, (newVal) => {
      songlistData.value = newVal.map((s) => {
        const songInfo = s.detail.songInfo;
        return {
          id: s.id,
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

    // hooks
    const { accessCompleteDataOfSongs } = useHomeViewControls();

    // methods
    // 点击播放全部歌曲
    const playbtnClick = () => {
      store.dispatch("setPlayerPlaylistOnly", completeSongsDataArr.value);
    };

    // 点击收藏歌单
    const focusbtnClick = () => {
      let t = 1;
      if (focus.value) {
        t = 2;
      }
      subscribePlaylist({ t, id: playlistInfo.value.id }).then((res) => {
        if (res.code === 200) {
          // 重新拉取数据
          if (t === 1) {
            messagebox.success("收藏成功");
          } else {
            messagebox.success("取消收藏成功");
          }
          store.dispatch("setLikedPlayLists", userId.value);
        } else {
          if (t === 1) {
            messagebox.warn("收藏失败");
          } else {
            messagebox.warn("取消收藏失败");
          }
        }
      });
    };
    return {
      // data
      userId,
      completeSongsDataArr,
      playlistInfo,
      songlistData,
      // computed
      userLikedPlaylist,
      focus,
      // methods
      timeTransform,
      moment,
      playbtnClick,
      focusbtnClick,
    };
  },
};
</script>

<style lang='scss' scoped>
.playlistview {
  margin: 75px auto 0;
  padding-bottom: 90px;
  height: calc(100% - 100px);
  overflow: auto;
  .creator {
    margin: 10px 0;
    font-size: 18px;
    font-weight: 700;
    img {
      width: 40px;
      height: 40px;
      border-radius: 5px;
    }
  }
}
</style>