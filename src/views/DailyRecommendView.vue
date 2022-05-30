<template>
  <div class="dailyrecommendview">
    <div class="container center">
      <div class="header">
        <div class="top">
          <div class="left">
            <div class="week">
              {{ weekConstant[moment().format("e")] }}
            </div>
            <div class="day">{{ moment().format("DD") }}</div>
          </div>
          <div class="right">每日歌曲推荐</div>
        </div>
        <div class="bottom">根据你的音乐口味生成&nbsp;·&nbsp;每天6:00更新</div>
      </div>
      <song-show-list :songlist="dailySongs"></song-show-list>
    </div>
  </div>
</template>

<script>
import * as moment from "moment";
import { getDailyRecommendSongs } from "@/api/songlist";
import { isTrackPlayable, timeTransform } from "@/utils/utils";
import SongShowList from "@/components/song-show-list/SongShowList.vue";
import { ref } from "vue";
export default {
  name: "DailyRecommendView",
  components: { SongShowList },
  setup() {
    // data
    const dailySongs = ref([]);
    const weekConstant = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ];

    // init data
    // 获取每日推荐歌单
    getDailyRecommendSongs().then((res) => {
      if (res.code === 200) {
        dailySongs.value = res.data.dailySongs.map((s) => {
          const detail = {
            songInfo: {
              fee: s.fee,
              noCopyrightRcmd: s.noCopyrightRcmd,
            },
            privilege: s.privilege,
          };
          return {
            id: s.id,
            songName: s.name,
            albumName: s.al.name,
            albumId: s.al.id,
            imgUrl: s.al.picUrl,
            time: timeTransform(s.dt),
            playable: isTrackPlayable(detail),
            artistArr: s.ar.map((a) => ({
              artistName: a.name,
              artistId: a.id,
            })),
          };
        });
      }
    });

    return {
      // data
      dailySongs,
      weekConstant,
      // methods
      moment,
    };
  },
};
</script>

<style lang='scss' scoped>
.dailyrecommendview {
  margin: 75px auto 0;
  padding-bottom: 90px;
  height: calc(100% - 100px);
  overflow: auto;
  .header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 400px;
    .top {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .left {
        margin-right: 20px;
        width: 140px;
        height: 140px;
        background-image: url("@/assets/images/date.png");
        background-repeat: no-repeat;
        .week {
          height: 30px;
          line-height: 30px;
          text-align: center;
          color: #fff;
        }
        .day {
          height: 110px;
          line-height: 110px;
          text-align: center;
          font-size: 80px;
          font-weight: 700;
          background-image: url("@/assets/images/date.png");
          background-repeat: no-repeat;
          background-position: 0 -148px;
        }
      }
      .right {
        color: #f34148;
        font-size: 80px;
        font-weight: 600;
      }
    }
    .bottom {
      font-size: 20px;
      font-weight: 500;
    }
  }
}
</style>