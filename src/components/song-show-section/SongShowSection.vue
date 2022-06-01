<template>
  <div
    class="songshowsection"
    v-if="finalSonglist.length > 0"
    ref="songShowSectionRef"
  >
    <div class="header" v-if="title">{{ title }}</div>
    <div class="body">
      <div
        class="item"
        v-for="song in finalSonglist"
        :key="song.id"
        :class="{ active: song.id === currentId }"
        v-clickZoomOut:[0.99]
        @click.stop="toSongView(song.id)"
      >
        <img
          v-lazy="song.hsAlbumCover"
          @click.stop="toAlbumView(song.hsAlbumId)"
        />
        <div class="desc">
          <div class="songName textoverflow-hidden-single">
            {{ song.hsName }}
          </div>
          <div class="albumName textoverflow-hidden-single">
            <span @click.stop="toAlbumView(song.hsAlbumId)">{{
              song.hsAlbumName
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="more">
      <span v-show="!hasShowMore && songlist.length > 12" @click.stop="showMore"
        >显示更多</span
      >
      <span v-show="hasShowMore" @click.stop="fold">收起</span>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref, toRefs, watch } from "vue";
export default {
  name: "SongShowSection",
  props: {
    songlist: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
    },
    currentId: {
      type: Number,
    },
  },
  setup(props, { emit }) {
    // router
    const router = useRouter();

    // data
    const songShowSectionRef = ref(null);
    const { songlist } = toRefs(props);
    const hasShowMore = ref(false);
    const finalSonglist = ref([]);

    //watch
    watch(songlist, (newVal) => {
      finalSonglist.value = newVal.slice(0, 12);
    });

    // methods
    // 1.展开、折叠方法
    const showMore = () => {
      finalSonglist.value = songlist.value;
      hasShowMore.value = true;
      songShowSectionRef.value.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };
    const fold = () => {
      finalSonglist.value = songlist.value.slice(0, 12);
      hasShowMore.value = false;
      songShowSectionRef.value.scrollIntoView({
        block: "start",
      });
    };
    // 2.跳转到专辑页面
    const toAlbumView = (albumId) => {
      router.push(`/album/${albumId}`);
    };
    // 3.跳转到单曲页面
    const toSongView = (songId) => {
      router.push(`/song/${songId}`);
    };
    return {
      // data
      songShowSectionRef,
      songlist,
      finalSonglist,
      hasShowMore,
      // methods
      showMore,
      fold,
      toAlbumView,
      toSongView,
    };
  },
};
</script>

<style lang='scss' scoped>
.songshowsection {
  @include not-allowed-select;
  .header {
    height: 50px;
    line-height: 50px;
    font-size: 22px;
    font-weight: 700;
  }
  .body {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 1208px;
    .active {
      background-color: #eee;
    }
    .item {
      display: flex;
      align-items: center;
      margin: 0 7px 5px 0;
      padding: 0 10px;
      width: 295px;
      height: 55px;
      border-radius: 8px;
      transition: all 5s ease;
      &:hover {
        background-color: #eee;
      }
      img {
        margin-right: 15px;
        width: 40px;
        height: 40px;
        border-radius: 5px;
        cursor: pointer;
      }
      .desc {
        width: 240px;
        .songName {
          font-size: 16px;
          font-weight: 700;
        }
        .albumName {
          width: 100%;
          height: 16px;
          font-size: 12px;
          span:hover {
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }
    }
  }
  .more {
    span {
      color: #888;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      &:hover {
        color: #666;
      }
    }
  }
}
</style>