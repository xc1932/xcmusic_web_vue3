<template>
  <div class="hotrecommend container center">
    <div class="rec-header">
      <div class="left">推荐歌曲</div>
      <div class="right">查看全部</div>
    </div>
    <div class="rec-body">
      <rectangle-show-box
        v-for="item in songlist"
        :key="item.id"
        :imgUrl="item.picUrl"
        imgHeight="225px"
        boxWidth="225px"
        boxHeight="300px"
        imgRadius="15px"
        :trackCount="item.trackCount"
        :copyWriter="item.copywriter"
      >
        <div class="description">
          {{ item.name }}
        </div>
        <div class="other">
          <span>播放量：{{ playCountConvert(item.playCount) }}</span>
          <span class="right">{{ createTime(item.trackNumberUpdateTime) }}</span>
        </div>
      </rectangle-show-box>
    </div>
  </div>
</template>

<script>
import RectangleShowBox from "@/components/base/rectangleShowBox";

export default {
  name: "HotRecommend",
  components: { RectangleShowBox },
  props:{
    songlist:{
      type:Array,
      default:[]
    }
  },
  setup() {
    // 播放量转换函数
    const playCountConvert = (playCount) => {
      return playCount > 10000
        ? (playCount / 10000).toFixed(1) + "万"
        : playCount;
    };
    // 创建时间
    const createTime = (updateTime) => {
      const time = new Date(updateTime);
      return `${time.getFullYear()}-${time.getMonth()}-${time.getDate()}`;
    };
    return {
      playCountConvert,
      createTime,
    };
  },
};
</script>

<style lang="scss" scoped>
.hotrecommend {
  margin-bottom: $margin-bottom;
  display: flex;
  flex-direction: column;
  .rec-header {
    height: 45px;
    line-height: 45px;
    display: flex;
    justify-content: space-between;
    .left {
      font-size: $font-size-large-x;
      font-weight: $font-weight-large-x;
    }
    .right {
      font-size: $font-size-small;
      font-weight: 900;
    }
  }
  .rec-body {
    height: 600px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    .description {
      width: 100%;
      height: 22px;
      margin-top: 10px;
      @include text-overflow-hidden(1);
      font-weight: 700;
    }
    .other{
      .right{
        float: right;
        padding-right: 3px;
      }
    }
  }
}
</style>