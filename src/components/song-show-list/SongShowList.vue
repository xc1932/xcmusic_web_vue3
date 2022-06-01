<template>
  <div class="songshowlist">
    <div
      class="item"
      v-for="item in songlist"
      :key="item.id"
      :class="{ disable: !item.playable.playable }"
      @click.stop="toSongView(item.id)"
    >
      <div class="left">
        <img v-lazy="item.imgUrl" @click.stop="toAlbumView(item.albumId)" />
        <div class="desc">
          <div class="songname textoverflow-hidden-single">
            <span>{{ item.songName }}</span>
          </div>
          <div
            class="singer textoverflow-hidden-single"
            v-show="item.artistArr.length > 0"
          >
            <span @click.stop="toArtistView(item.artistArr[0].artistId)"
              >{{ item.artistArr[0].artistName }}
            </span>
            <span
              v-for="artist in item.artistArr.slice(1)"
              :key="artist.artistId"
              @click.stop="toArtistView(artist.artistId)"
            >
              / {{ artist.artistName }}</span
            >
          </div>
        </div>
      </div>
      <div class="center textoverflow-hidden-single">
        <span @click.stop="toAlbumView(item.albumId)">{{
          item.albumName
        }}</span>
      </div>
      <div class="right textoverflow-hidden-single">
        <div class="focuson" @click.stop="likeASong(item.id)">
          <img
            src="@/assets/svg/like2.svg"
            v-if="likedSongs.includes(item.id)"
          />
          <img src="@/assets/svg/like.svg" v-else />
        </div>
        <span class="time">{{ item.time }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import useLikeSong from "@/components/player/hooks/useLikeSong";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, computed } from "vue";
export default {
  name: "SongShowList",
  props: {
    songlist: {
      type: Array,
      default: [],
    },
  },
  setup() {
    // router
    const router = useRouter();

    // vuex
    const store = useStore();
    const likedSongs = computed(() => store.getters.getLikedSongs);

    // hooks
    const { likeASong } = useLikeSong();

    // data
    const focusOn = ref(false);

    // methods
    // 1.跳转到专辑页面
    const toAlbumView = (albumId) => {
      router.push(`/album/${albumId}`);
    };
    // 2.跳转到歌手页面
    const toArtistView = (artistId) => {
      router.push(`/artist/${artistId}`);
    };
    // 3.跳转到单曲页面
    const toSongView = (songId) => {
      router.push(`/song/${songId}`);
    };

    return {
      // vuex
      likedSongs,
      // hooks
      likeASong,
      // data
      focusOn,
      // methods
      toAlbumView,
      toArtistView,
      toSongView,
    };
  },
};
</script>

<style lang='scss' scoped>
.songshowlist {
  padding: 5px 0;
  .disable {
    filter: grayscale(1) opacity(0.6);
  }
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    height: 70px;
    border-radius: 15px;
    @include not-allowed-select;
    &:hover {
      background-color: #f5f5f7;
    }
    .left {
      flex-grow: 1;
      display: flex;
      img {
        margin-right: 15px;
        width: 55px;
        height: 55px;
        border-radius: 5px;
        cursor: pointer;
      }
      .desc {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 430px;
        .songname {
          span {
            font-size: 18px;
            font-weight: 700;
          }
        }
        .singer {
          span {
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
    .center {
      width: 500px;
      span {
        font-size: 20px;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .right {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100px;
      .focuson {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        cursor: pointer;
        img {
          width: 70%;
          height: 70%;
        }
      }
      .time {
        font-size: 20px;
        text-align: center;
      }
    }
  }
}
</style>