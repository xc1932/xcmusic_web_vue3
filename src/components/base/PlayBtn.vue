<template>
  <div class="playbtn" v-clickZoomOut>
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-play"></use>
    </svg>
  </div>
</template>

<script>
export default {
  name: "PlayBtn",
  setup(props) {},
};
</script>

<style lang='scss' scoped>
.playbtn {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: $border-radius-circle;
  @include bg-frostedglass;
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
</style>