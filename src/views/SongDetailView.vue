<template>
  <div class="SongDetailView">
    <div class="container center">
      <div class="desc" v-if="desc.songInfo">
        <div class="left">
          <img v-lazy="desc.songInfo.al.picUrl" :title="desc.playable.reason" />
        </div>
        <div class="right">
          <div class="songName">单曲:&nbsp;&nbsp;{{ desc.songInfo.name }}</div>
          <div class="singerName">
            歌手:&nbsp;&nbsp;
            <span
              v-for="artist in desc.songInfo.ar"
              :key="artist.id"
              @click.stop="toArtistView(artist.id)"
            >
              {{ artist.name }}&nbsp;
            </span>
          </div>
          <div class="albumName" @click.stop="toAlbumView(desc.songInfo.al.id)">
            专辑:&nbsp;&nbsp;<span>{{ desc.songInfo.al.name }}</span>
          </div>
          <div class="btns">
            <div class="play" v-clickZoomOut @click.stop="play">播放</div>
          </div>
        </div>
      </div>
      <div class="lyricSection">
        <div class="lyric" v-for="lyric in lyricArr" :key="lyric.startTime">
          {{ lyric.lyricDesc }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useLyricController from "@/components/player/hooks/useLyricController";
import useHomeViewControls from "./hooks/useHomeViewControls";
import { getLyric } from "@/api/song";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, reactive, watch } from "vue";
export default {
  name: "SongDetailView",
  props: ["id"],
  setup(props) {
    // vue-router
    const router = useRouter();
    // vuex
    const store = useStore();
    // hooks
    const { accessCompleteDataOfSongs } = useHomeViewControls();
    const { lyricToObj } = useLyricController();
    // data
    const id = props.id;
    const completePlayData = ref([]);
    let lyricArr = reactive([]);
    let desc = reactive({});

    // watch
    watch(completePlayData, (newVal) => {
      desc.songInfo = newVal[0].detail.songInfo;
      desc.playable = newVal[0].playable;
    });

    // methods
    const toAlbumView = (albumId) => {
      router.push(`/album/${albumId}`);
    };
    const toArtistView = (artistId) => {
      router.push(`/artist/${artistId}`);
    };
    const play = () => {
      if (completePlayData.value.length > 0) {
        store.dispatch("setPlayerPlaylistOnly", completePlayData.value);
      }
    };

    // init data
    // 获取完整的播放数据
    accessCompleteDataOfSongs([id], completePlayData);
    // 获取歌词数据
    getLyric({ id }).then((res) => {
      if (res.code === 200) {
        const lyricObj = lyricToObj(res.lrc.lyric);
        for (let l in lyricObj) {
          lyricArr.push({
            startTime: lyricObj[l].startTime,
            lyricDesc: lyricObj[l].lyricDesc,
          });
        }
        lyricArr.sort((a, b) => a.startTime - b.startTime);
      }
    });

    return {
      // data
      completePlayData,
      lyricArr,
      desc,
      // methods
      toAlbumView,
      toArtistView,
      play,
    };
  },
};
</script>

<style lang='scss' scoped>
.SongDetailView {
  margin: 75px auto 0;
  padding-bottom: 90px;
  height: calc(100% - 100px);
  overflow: auto;
  .container {
    .desc {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
      .left {
        margin-right: 50px;
        border-radius: 15px;
        overflow: hidden;
        img {
          width: 200px;
          height: 200px;
        }
      }
      .right {
        height: 200px;
        .songName {
          margin-bottom: 15px;
          font-size: 32px;
          font-weight: 700;
        }
        .singerName,
        .albumName {
          span {
            font-size: 22px;
            font-weight: 700;
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }
        }
        .singerName,
        .albumName {
          font-size: 22px;
          font-weight: 700;
          color: #666;
        }
        .btns {
          margin-top: 15px;
          .play {
            width: 100px;
            height: 35px;
            line-height: 31px;
            border: 2px solid black;
            border-radius: 5px;
            text-align: center;
            font-size: 18px;
            font-weight: 900;
            &:hover {
              background-color: #eee;
            }
          }
        }
      }
    }
    .lyricSection {
      opacity: 0.5;
      .lyric {
        height: 35px;
        line-height: 35px;
        font-size: 18px;
        font-weight: 600;
        text-align: center;
      }
    }
  }
}
</style>