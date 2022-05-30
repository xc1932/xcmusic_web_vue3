<template>
  <div class="lyricScoller" ref="lyricScollerRef" :style="lyricScollerStyle">
    <div
      class="line textoverflow-hidden-single"
      :class="{ selected: curLine === index }"
      v-for="(lyricLine, index) in lyricArr"
      :key="index"
    >
      {{
        translate && lyricLine.tlyricDesc
          ? lyricLine.tlyricDesc
          : lyricLine.lyricDesc
      }}
    </div>
  </div>
</template>

<script>
import useLyricController from "./hooks/useLyricController";
import { useStore } from "vuex";
import { ref, toRefs, computed, watch } from "vue";
export default {
  name: "LyricScoller",
  props: {
    widthProp: {
      type: Number,
      default: 300,
    },
    heightProp: {
      type: Number,
      default: 400,
    },
    startScrollLine: {
      type: Number,
      default: 7,
    },
    translate: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { widthProp, heightProp, translate } = toRefs(props);
    const startScrollLine = props.startScrollLine;
    const lyricScollerRef = ref(null);
    // vuex
    const store = useStore();
    const curSong = computed(() => store.getters.getCurSong);

    // hooks
    const { lyricArr, curLine } = useLyricController(
      lyricScollerRef,
      startScrollLine
    );

    // computed
    const lyricScollerStyle = computed(() => ({
      width: widthProp.value + "px",
      height: heightProp.value + "px",
      opacity: curSong.value.id ? 1 : 0,
    }));

    // watch
    // 1.监听正在播放歌词的变化,滚动歌词
    watch(curLine, (newCurLine) => {
      const lyricScollerEl = lyricScollerRef.value;
      if (newCurLine === 0) {
        lyricScollerEl.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
      if (newCurLine >= startScrollLine) {
        // lyricScollerEl.scrollTop = 30 * (newCurLine - 6);
        lyricScollerEl.scrollTo({
          top: 30 * (newCurLine - (startScrollLine - 1)),
          left: 0,
          behavior: "smooth",
        });
      }
    });

    return {
      lyricScollerRef,
      // vuex
      curSong,
      lyricArr,
      curLine,
      lyricScollerStyle,
      translate,
    };
  },
};
</script>

<style lang='scss' scoped>
.lyricScoller {
  color: #fff;
  //   background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  cursor: grab;
  transition: all 0.5s ease;
  @include not-allowed-select;
  .line {
    height: 30px;
    line-height: 30px;
    text-align: center;
    opacity: 0.5;
    transition: all 0.5s ease;
  }
  .selected {
    // background-color: rgba(255, 255, 255, 0.2);
    opacity: 1;
    transform: scale(1.1);
  }
}
</style>