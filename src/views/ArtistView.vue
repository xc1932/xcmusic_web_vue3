<template>
  <div class="artistview">
    <div class="container center">
      <!-- 歌手信息展示区域 -->
      <div class="basicInfoSection">
        <info-show-section
          v-show="basicInfo"
          borderRadius="50%"
          :imgUrl="basicInfo?.avatar"
          :title="basicInfo?.name"
          :desc="basicInfo?.briefDesc"
          :focus="focusOn"
          @playbtnClick="playbtnClick"
          @focusbtnClick="focusbtnClick(basicInfo?.id)"
        >
          <div class="desc" @click.stop="scrollIntoView">
            <div class="profession">艺人</div>
            <div class="briefDesc">
              <span class="musicsize">{{ basicInfo?.musicSize }}首歌</span>
              &nbsp;·&nbsp;
              <span class="albumsize">{{ basicInfo?.albumSize }}张专辑</span>
              &nbsp;·&nbsp;
              <span class="mvsize">{{ basicInfo?.mvSize }}个MV</span>
            </div>
          </div>
        </info-show-section>
      </div>
      <!-- 最新发布区域 -->
      <div class="latestSection">
        <latest-release-section
          :latestRelease="latestRelease"
        ></latest-release-section>
      </div>
      <!-- 热门歌曲 -->
      <div class="hotSongsSection" ref="hotSongsSectionRef">
        <song-show-section
          title="热门歌曲"
          :songlist="hotSongs"
          :currentId="currentId"
        ></song-show-section>
      </div>
      <!-- 专辑区域 -->
      <div class="albumSection" ref="albumSectionRef">
        <album-show-section
          title="专辑"
          :albumlist="albums"
        ></album-show-section>
      </div>
      <!-- MV区域 -->
      <div class="mvSection" ref="mvSectionRef">
        <mv-show-section title="MVs" :mvlist="mvs"></mv-show-section>
      </div>
      <!-- 单曲区域 -->
      <div class="singleAndEPSection">
        <album-show-section
          title="Single and EP"
          :albumlist="singleAndEPs"
        ></album-show-section>
      </div>
      <!-- 相似艺人区域 -->
      <div class="similarArtistSection">
        <similar-artist-section
          :similarArtists="similarArtists"
          title="相似艺人"
        ></similar-artist-section>
      </div>
    </div>
  </div>
</template>

<script>
import SimilarArtistSection from "@/components/similar-artist-section/SimilarArtistSection.vue";
import MvShowSection from "@/components/mv-show-section/MvShowSection.vue";
import SongShowSection from "@/components/song-show-section/SongShowSection.vue";
import AlbumShowSection from "@/components/album-show-section/AlbumShowSection.vue";
import LatestReleaseSection from "@/components/latest-release-section/LatestReleaseSection.vue";
import InfoShowSection from "@/components/info-show-section/InfoShowSection.vue";
import useGetArtistViewData from "./hooks/useGetArtistViewData";
import { ref } from "vue";
export default {
  name: "ArtistView",
  components: {
    InfoShowSection,
    LatestReleaseSection,
    AlbumShowSection,
    SongShowSection,
    MvShowSection,
    SimilarArtistSection,
  },
  props: ["id"],
  setup(props) {
    // data
    const hotSongsSectionRef = ref(null);
    const albumSectionRef = ref(null);
    const mvSectionRef = ref(null);

    // hooks
    const {
      currentId,
      basicInfo,
      latestRelease,
      hotSongs,
      albums,
      mvs,
      singleAndEPs,
      similarArtists,
      focusOn,
      completeHotSongsData,
      playbtnClick,
      focusbtnClick
    } = useGetArtistViewData(props.id*1);

    // methods
    // 1.滚动到对应区域
    const scrollIntoView = (e) => {
      const options = {
        behavior: "smooth",
        block: "start",
      };
      if (e.target.className === "musicsize") {
        hotSongsSectionRef.value.scrollIntoView(options);
      } else if (e.target.className === "albumsize") {
        albumSectionRef.value.scrollIntoView(options);
      } else if (e.target.className === "mvsize") {
        mvSectionRef.value.scrollIntoView(options);
      }
    };

    return {
      // vuex
      currentId,
      // data
      hotSongsSectionRef,
      albumSectionRef,
      mvSectionRef,
      // hooks
      basicInfo,
      latestRelease,
      hotSongs,
      albums,
      mvs,
      singleAndEPs,
      similarArtists,
      focusOn,
      completeHotSongsData,
      playbtnClick,
      focusbtnClick,
      // methods
      scrollIntoView,
    };
  },
};
</script>

<style lang='scss' scoped>
.artistview {
  margin: 75px auto 0;
  padding-bottom: 90px;
  height: calc(100% - 100px);
  overflow: auto;
  .basicInfoSection {
    margin-bottom: 30px;
    .desc {
      .profession {
        margin-top: 20px;
        font-size: 20px;
        font-weight: 500;
      }
      .briefDesc {
        span {
          color: #2d2e2d;
        }
        span:hover {
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }
  .latestSection,
  .hotSongsSection,
  .albumSection,
  .mvSection,
  .singleAndEPSection,
  .similarArtistSection {
    margin-bottom: 50px;
  }
}
</style>