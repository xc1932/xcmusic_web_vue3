<template>
  <div class="rectangleshowbox center" :style="boxStyle">
    <div
      class="imgBox"
      ref="imgBoxRef"
      :style="imgBoxStyle"
      @mouseenter="showPlay"
      @mouseleave="hidePlay"
    >
      <img :src="imgUrl" ref="imgRef" />
      <div class="play" ref="playRef" v-clickZoomOut>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-play"></use>
        </svg>
      </div>
      <div
        class="desBox"
        v-if="trackCount !== undefined && copyWriter !== undefined"
      >
        <div class="left">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-yinle"></use>
          </svg>
          <span>{{ trackCount }}首</span>
        </div>
        <div class="right">{{ copyWriter }}</div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "RectangleShowBox",
  props: {
    boxWidth: {
      type: String,
      default: "200px",
    },
    boxHeight: {
      type: String,
      default: "300px",
    },
    boxbgc: {
      type: String,
    },
    imgUrl: String,
    imgHeight: {
      type: String,
      required: true,
    },
    imgRadius: {
      type: String,
    },
    trackCount: {
      type: Number,
    },
    copyWriter: {
      type: String,
    },
  },
  setup(props) {
    // data
    const imgBoxRef = ref({});
    const imgRef = ref({});
    const playRef = ref({});
    // box样式
    const boxStyle = ref({
      width: props.boxWidth,
      height: props.boxHeight,
      backgroundColor: props.boxbgc,
    });
    // imgBox样式
    const imgBoxStyle = ref({
      height: props.imgHeight,
      borderRadius: props.imgRadius,
    });
    // 显示播放按钮动画
    const showPlay = () => {
      playRef.value.style.opacity = 1;
      playRef.value.style.transform = "scale(1.2)";
      imgRef.value.style.transform = "scale(1.1)";
    };
    // 隐藏播放按钮动画
    const hidePlay = () => {
      playRef.value.style.opacity = 0;
      playRef.value.style.transform = "scale(1)";
      imgRef.value.style.transform = "scale(1)";
    };
    return {
      imgBoxRef,
      imgRef,
      playRef,
      boxStyle,
      imgBoxStyle,
      showPlay,
      hidePlay,
    };
  },
};
</script>

<style lang="scss" scoped>
.rectangleshowbox {
  margin: 0;
  .imgBox {
    border-radius: 15px;
    overflow: hidden;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      transition: transform 0.75s;
    }
    .play {
      opacity: 0;
      width: 50px;
      height: 50px;
      border-radius: $border-radius-circle;
      @include bg-frostedglass;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      transition: all 0.3s;
      &:hover {
        @include bg-frostedglass-deep;
      }
      svg {
        position: absolute;
        top: 50%;
        left: 54%;
        transform: translate(-50%, -50%);
      }
    }
    .desBox {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      height: 30px;
      line-height: 30px;
      color: $color-bg-white;
      font-weight: 700;
      background-color: rgba(0, 0, 0, 0.5);
      .left {
        float: left;
        height: 100%;
        padding-left: 27px;
        svg {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 5px;
          margin: auto 0;
        }
      }
      .right {
        float: right;
        padding-right: 10px;
      }
    }
  }
}
</style>