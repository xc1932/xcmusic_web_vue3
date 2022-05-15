<template>
  <div class="volumecontroller">
    <!-- 音量图标 -->
    <div class="volumeicon" @click="clickHandler">
      <svg class="icon" aria-hidden="true" v-show="!muted && volume >= 0.6">
        <use xlink:href="#icon-shengyin01-mianxing"></use>
      </svg>
      <svg
        class="icon"
        aria-hidden="true"
        v-show="!muted && volume < 0.6 && volume >= 0.3"
      >
        <use xlink:href="#icon-shengyin02-mianxing"></use>
      </svg>
      <svg
        class="icon"
        aria-hidden="true"
        v-show="!muted && volume < 0.3 && volume > 0"
      >
        <use xlink:href="#icon-shengyin03-mianxing"></use>
      </svg>
      <svg class="icon" aria-hidden="true" v-show="muted || volume === 0">
        <use xlink:href="#icon-shengyin04-mianxing"></use>
      </svg>
    </div>
    <!-- 进度条 -->
    <process-bar
      :processbarWidth="100"
      :processProp="volume"
      @processChanged="getProcess"
    ></process-bar>
  </div>
</template>

<script>
import useVolumeController from "./hooks/useVolumeController";
import ProcessBar from "./ProcessBar.vue";
import { watch ,onMounted} from "vue";
export default {
  name: "VolumeController",
  components: { ProcessBar },
  emits: ["volumeChanged"],
  setup(props, { emit }) {
    const { getProcess, volume, muted, clickHandler, cacheVolume } =
      useVolumeController();
    // 监听volume变化传递给父组件
    watch(
      volume,
      (newVolume) => {
        emit("volumeChanged", newVolume);
      }
    );
    // 在界面渲染后初始化audio的音量大小
    onMounted(()=>{
        emit("volumeChanged", volume.value);
    })
    return {
      getProcess,
      volume,
      muted,
      clickHandler,
      cacheVolume,
    };
  },
};
</script>

<style lang="scss" scoped>
.volumecontroller {
  cursor: pointer;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
  display: flex;
  align-items: center;
  .volumeicon {
    width: 28px;
    height: 28px;
    overflow: hidden;
    margin-right: 10px;
  }
}
</style>