<template>
  <div class="infoshowsection">
    <div class="left">
      <img
        v-lazy="imgUrl"
        v-show="imgUrl"
        :style="{ borderRadius: borderRadius }"
      />
    </div>
    <div class="right">
      <div class="title textoverflow-hidden-single">{{ title }}</div>
      <div class="slot">
        <slot></slot>
      </div>
      <div class="desc">{{ desc }}</div>
      <div class="btns">
        <div
          class="play"
          v-mousehoverZoom
          v-clickZoomOut
          @click.stop="playbtnClick"
        >
          <img src="@/assets/svg/play.svg" />
          <span>播放</span>
        </div>
        <div
          class="focuson"
          v-mousehoverZoom
          v-clickZoomOut
          @click.stop="focusbtnClick"
        >
          <img src="@/assets/svg/like2.svg" v-if="focus" />
          <img src="@/assets/svg/like.svg" v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InfoShowSection",
  props: {
    borderRadius: {
      type: String,
      default: "15px",
    },
    imgUrl: {
      type: String,
    },
    title: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      default: "",
    },
    focus: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["playbtnClick", "focusbtnClick"],
  setup(props, { emit }) {
    // methods
    // 1.
    const playbtnClick = () => {
      emit("playbtnClick");
    };
    // 2.
    const focusbtnClick = () => {
      emit("focusbtnClick");
    };
    return {
      // methods
      playbtnClick,
      focusbtnClick,
    };
  },
};
</script>

<style lang='scss' scoped>
.infoshowsection {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 350px;
  //   background-color: #eee;
  .left {
    width: 350px;
    img {
      width: 300px;
      height: 300px;
      margin-right: 50px;
      box-shadow: -4px 4px 15px 2px rgba(0, 0, 0, 0.2);
    }
  }
  .right {
    width: 800px;
    height: 300px;
    .title {
      height: 70px;
      line-height: 70px;
      font-size: 35px;
      font-weight: 700;
    }
    .slot {
      height: 100px;
    }
    .desc {
      height: 40px;
      line-height: 20px;
      font-size: 14px;
      @include text-overflow-hidden;
    }
    .btns {
      display: flex;
      align-items: center;
      height: 80px;
      .play,
      .focuson {
        img {
          width: 28px;
          height: 28px;
        }
      }
      .play {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 20px;
        background-color: #eee;
        width: 100px;
        height: 40px;
        border-radius: 10px;
        img {
          margin-right: 5px;
        }
        span {
          font-size: 17px;
          font-weight: 700;
        }
      }
      .focuson {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: #eee;
      }
    }
  }
}
</style>