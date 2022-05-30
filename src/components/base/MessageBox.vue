<template>
  <div class="messagebox">
    <svg class="icon" aria-hidden="true" v-if="msgBoxType === 0">
      <use xlink:href="#icon-success"></use>
    </svg>
    <svg class="icon" aria-hidden="true" v-else-if="msgBoxType === 1">
      <use xlink:href="#icon-prompt"></use>
    </svg>
    <span class="msg">{{ msg }}</span>
  </div>
</template>

<script>
export default {
  name: "MessageBox",
  props: {
    msgBoxType: {
      type: Number,
      default: 0,
    },
    msg: {
      type: String,
      default: "nothing",
    },
  },
  setup(props) {},
};
</script>

<style lang='scss' scoped>
.messagebox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  margin: auto;
  width: 200px;
  height: 200px;
  border-radius: 15px;
  background-color: rgba(0, 0, 0, 0.7);
  svg {
    margin-bottom: 15px;
    width: 70px;
    height: 70px;
  }
  .msg {
    font-size: 22px;
    color: #fff;
  }
}
</style>