<template>
  <div
    class="playlistshowsection"
    v-if="realPlaylists.length > 0"
    ref="playlistShowSectionRef"
  >
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
  </div>
</template>

<script>
import * as moment from "moment";
import useHomeViewControls from "@/views/hooks/useHomeViewControls";
import RectangleShowBox from "@/components/base/RectangleShowBox";
import { useRouter } from "vue-router";
import { ref, toRefs, watch } from "vue";
export default {
  name: "PlaylistShowList",
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
    const realPlaylists = ref([]);

    // watch
    watch(
      playlists,
      (newVal) => {
        realPlaylists.value = newVal.slice(0);
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

    return {
      // data
      playlistShowSectionRef,
      realPlaylists,
      // methods
      toPlaylistView,
      playAllSongInPlaylist,
      moment,
    };
  },
};
</script>

<style lang='scss' scoped>
.playlistshowsection {
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
}
</style>