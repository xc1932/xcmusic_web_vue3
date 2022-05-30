<template>
  <div
    class="playlistshowsection"
    v-if="realPlaylists.length > 0"
    ref="playlistShowSectionRef"
  >
    <div class="header" v-if="title">
      <div class="title">{{ title }}</div>
      <div
        class="showmoreBtn"
        @click.stop="showMore"
        v-if="!hasShowMore && playlists.length > 10"
      >
        显示更多
      </div>
    </div>
    <div class="body">
      <div class="item" v-for="playlist in realPlaylists" :key="playlist.id">
        <rectangle-show-box
          imgHeight="225px"
          boxWidth="225px"
          boxHeight="290px"
          imgRadius="15px"
          :imgUrl="playlist.playlistCover"
          @playbtnClick="playAllSongInPlaylist(playlist)"
          @click="toPlaylistView(playlist.id)"
        >
          <div
            class="playlistname textoverflow-hidden-single"
            @click.stop="toPlaylistView(playlist.id)"
          >
            {{ playlist.playlistName }}
          </div>
        </rectangle-show-box>
      </div>
    </div>
    <div class="foldBtn" @click.stop="fold" v-show="hasShowMore">收起</div>
  </div>
</template>

<script>
import * as moment from "moment";
import useHomeViewControls from "@/views/hooks/useHomeViewControls";
import RectangleShowBox from "@/components/base/RectangleShowBox";
import { useRouter } from "vue-router";
import { ref, toRefs, watch } from "vue";
export default {
  name: "PlaylistShowSection",
  components: { RectangleShowBox },
  props: {
    playlists: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
    },
  },
  setup(props) {
    // router
    const router = useRouter();

    // data
    const { playlists } = toRefs(props);
    const playlistShowSectionRef = ref(null);
    const hasShowMore = ref(false);
    const realPlaylists = ref([]);

    // watch
    watch(
      playlists,
      (newVal) => {
        realPlaylists.value = newVal.slice(0, 10);
      },
      { immediate: true }
    );

    // hooks
    const { playAllSongInPlaylist } = useHomeViewControls();

    // methods
    // 1.跳转到专辑页面
    const toPlaylistView = (playlistId) => {
      router.push(`/playlist/${playlistId}`);
    };
    // 2.展示更多
    const showMore = () => {
      realPlaylists.value = props.playlists;
      hasShowMore.value = true;
      playlistShowSectionRef.value.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };
    // 3.折叠
    const fold = () => {
      realPlaylists.value = props.playlists.slice(0, 10);
      hasShowMore.value = false;
      playlistShowSectionRef.value.scrollIntoView({
        block: "start",
      });
    };

    return {
      // data
      playlistShowSectionRef,
      hasShowMore,
      realPlaylists,
      // methods
      toPlaylistView,
      playAllSongInPlaylist,
      moment,
      showMore,
      fold,
    };
  },
};
</script>

<style lang='scss' scoped>
.playlistshowsection {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 20px;
    height: 50px;
    .title {
      font-size: 22px;
      font-weight: 700;
    }
    .showmoreBtn {
      color: #888;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      &:hover {
        color: #666;
      }
    }
  }
  .body {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    width: 1225px;
    .item {
      margin-right: 19px;
      width: 225px;
      height: 290px;
      .playlistname {
        padding-top: 6px;
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
      .desc {
        font-size: 14px;
        font-weight: 500;
        color: #888;
      }
    }
  }
  .foldBtn {
    color: #888;
    font-size: 14px;
    font-weight: 700;
    text-align: right;
    cursor: pointer;
    &:hover {
      color: #666;
    }
  }
}
</style>