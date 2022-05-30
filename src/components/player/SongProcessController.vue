<template>
  <div class="songProcessController">
    <div class="top">
      <div class="lyrics textoverflow-hidden-single">
        {{
          translate && lyricArr[curLine]?.tlyricDesc
            ? lyricArr[curLine]?.tlyricDesc
            : lyricArr[curLine]?.lyricDesc
        }}
      </div>
      <div class="timer">
        {{ currentTime || "00:00" }} /
        {{ timeTransform(currentSong?.detail?.songInfo.dt || 0) }}
      </div>
    </div>
    <div class="processBar">
      <process-bar
        :processbarWidth="665"
        :processProp="playProcess"
        :clickCB="clickCB"
        :mouseupCB="mouseupCB"
        @processChanged="getProcess"
      ></process-bar>
    </div>
  </div>
</template>

<script>
import useLyricController from "./hooks/useLyricController";
import ProcessBar from "./ProcessBar.vue";
import { timeTransform } from "@/utils/utils";
import { useStore } from "vuex";
import { ref, computed, watch } from "vue";
export default {
  name: "SongProcessController",
  props: {
    translate: {
      type: Boolean,
      default: false,
    },
  },
  components: { ProcessBar },
  emits: ["songProcessChanged"],
  setup(props, { emit }) {
    // data
    const currentTime = ref(0);
    // vuex
    const store = useStore();
    const currentSong = computed(() => store.getters.getCurSong);
    const playProcess = computed(() => store.getters.getPlayProcess);

    // hooks
    const { lyricArr, curLine } = useLyricController();

    // watch
    // 监听进度设置当前播放时间显示
    watch(playProcess, (newPlayProcess) => {
      currentTime.value = timeTransform(
        newPlayProcess * currentSong.value?.detail?.songInfo.dt
      );
    });

    // methods
    const getProcess = (newProcess) => {
      emit("songProcessChanged", newProcess);
    };

    const clickCB = (newProcess) => {};

    const mouseupCB = (newProcess) => {};

    return {
      // vuex
      currentSong,
      playProcess,
      currentTime,
      getProcess,
      // hooks
      lyricArr,
      curLine,
      // methods
      timeTransform,
      clickCB,
      mouseupCB,
    };
  },
};
</script>

<style lang="scss" scoped>
.songProcessController {
  width: 700px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .top {
    width: 95%;
    height: 30px;
    color: #bfbab9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .lyrics {
      flex-grow: 1;
    }
    .timer {
      min-width: 100px;
      text-align: right;
    }
  }
}
</style>