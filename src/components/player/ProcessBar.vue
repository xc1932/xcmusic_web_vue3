<template>
  <div
    class="processbar"
    ref="processbarRef"
    :style="{ width: processbarWidth + 'px' }"
    @click="onclickHandler"
  >
    <div class="processline" ref="lineRef" :style="{ width: lineWidth + 'px' }"></div>
    <div
      class="processcircle"
      ref="circleRef"
      :style="{ left: lineWidth - 5 + 'px' }"
      @mousedown="mouseDownHandelr"
    ></div>
  </div>
</template>

<script>
import useProcessBarController from "./hooks/useProcessBarController";
import { ref, computed, watch, toRef } from "vue";
export default {
  name: "ProcessBar",
  props: {
    processbarWidth: {
      type: Number,
      default: 300,
    },
    processProp: {
      type: Number,
      default: 0,
    },
  },
  emits: ["processChanged"],
  setup(props, { emit }) {
    const processbarRef = ref(null);
    const processProp = toRef(props, "processProp");
    const { process, onclickHandler, mouseDownHandelr,lineRef,circleRef } =
      useProcessBarController(props.processbarWidth, processProp);
    const lineWidth = computed(() => process.value * props.processbarWidth);
    // 监听process的改变通知父组件
    watch(process, (newProcess) => {
      emit("processChanged", newProcess);
    });
   
    return {
      processbarRef,
      lineWidth,
      onclickHandler,
      mouseDownHandelr,
      lineRef,
      circleRef
    };
  },
};
</script>

<style lang="scss" socped>
.processbar {
  position: relative;
  box-sizing: border-box;
  height: 22px;
  padding: 10px 0 10px 0;
  background-color: #796156;
  background-clip: content-box;
  cursor: pointer;
  .processline {
    height: 100%;
    background-color: #d5cfcd;
  }
  .processcircle {
    position: absolute;
    top: 6px;
    left: -5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #fff;
  }
}
</style>