<template>
  <div
    class="albumshowsection"
    v-if="realAlbumlist.length > 0"
    ref="albumShowSectionRef"
  >
    <div class="header" v-if="title">
      <div class="title">{{ title }}</div>
      <div
        class="showmoreBtn"
        @click.stop="showMore"
        v-if="!hasShowMore && albumlist.length > 10"
      >
        显示更多
      </div>
    </div>
    <div class="body">
      <div class="item" v-for="album in realAlbumlist" :key="album.id">
        <rectangle-show-box
          imgHeight="225px"
          boxWidth="225px"
          boxHeight="290px"
          imgRadius="15px"
          :imgUrl="album.albumCover"
          @playbtnClick="playAllSongInAlbum(album)"
          @click="toAlbumView(album.id)"
        >
          <div
            class="albumname textoverflow-hidden-single"
            @click.stop="toAlbumView(album.id)"
          >
            {{ album.albumName }}
          </div>
          <div class="desc textoverflow-hidden-single">
            {{ album.albumType }}&nbsp;·&nbsp;{{
              moment(album.albumPublishTime).format("YYYY")
            }}
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
  name: "AlbumShowSection",
  components: { RectangleShowBox },
  props: {
    albumlist: {
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
    const { albumlist } = toRefs(props);
    const albumShowSectionRef = ref(null);
    const hasShowMore = ref(false);
    const realAlbumlist = ref([]);

    // watch
    watch(
      albumlist,
      (newVal) => {
        realAlbumlist.value = newVal.slice(0, 10);
      },
      {
        immediate: true,
      }
    );

    // hooks
    const { playAllSongInAlbum } = useHomeViewControls();

    // methods
    // 1.跳转到专辑页面
    const toAlbumView = (albumId) => {
      router.push(`/album/${albumId}`);
    };
    // 2.展示更多
    const showMore = () => {
      realAlbumlist.value = props.albumlist;
      hasShowMore.value = true;
      albumShowSectionRef.value.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };
    // 3.折叠
    const fold = () => {
      realAlbumlist.value = props.albumlist.slice(0, 10);
      hasShowMore.value = false;
      albumShowSectionRef.value.scrollIntoView({
        block: "start",
      });
    };

    return {
      // data
      albumShowSectionRef,
      hasShowMore,
      realAlbumlist,
      // methods
      toAlbumView,
      playAllSongInAlbum,
      moment,
      showMore,
      fold,
    };
  },
};
</script>

<style lang='scss' scoped>
.albumshowsection {
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
      .albumname {
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