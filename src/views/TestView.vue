<template>
  <div class="testview">
    <div class="wrap container center">
      <similar-artist-section></similar-artist-section>
      <!-- <mv-show-section></mv-show-section> -->
      <!-- <song-show-section></song-show-section> -->
      <!-- <latest-release-section></latest-release-section> -->
      <!-- <album-show-section></album-show-section> -->
      <!-- <info-show-section></info-show-section>
      <song-show-list></song-show-list> -->
    </div>
  </div>
</template>

<script>
import SimilarArtistSection from '@/components/similar-artist-section/SimilarArtistSection.vue'
import MvShowSection from "@/components/mv-show-section/MvShowSection.vue";
import SongShowSection from "@/components/song-show-section/SongShowSection.vue";
import LatestReleaseSection from "@/components/latest-release-section/LatestReleaseSection.vue";
import AlbumShowSection from "@/components/album-show-section/AlbumShowSection.vue";
import InfoShowSection from "@/components/info-show-section/InfoShowSection.vue";
import SongShowList from "@/components/song-show-list/SongShowList.vue";
export default {
  name: "TestView",
  components: {
    SongShowList,
    InfoShowSection,
    AlbumShowSection,
    LatestReleaseSection,
    SongShowSection,
    MvShowSection,
    SimilarArtistSection
  },
  setup() {},
};
</script>

<style lang='scss' scoped>
.testview {
  // background-color: #bfa;
  margin: 75px 0 0 0;
  height: 100%;
  .wrap {
    height: 100%;
  }
}
</style>