<template>
  <div class="checkboxBC">
    <input type="checkbox" :id="inputId" :checked="checked" @click.stop />
    <label :for="inputId" @click.stop></label>
  </div>
</template>

<script>
export default {
  name: "CheckBoxBC",
  props: ["inputId", "checked"],
};
</script>

<style lang="scss" scoped>
.checkboxBC {
  width: 20px;
  input {
    display: none;
    z-index: -1;
  }
  label {
    z-index: -1;
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 1px solid #fff;
    position: relative;
    opacity: 0.5;
    transition: opacity 0.2s ease;
    &:hover {
      opacity: 1;
    }
  }
  label::before {
    display: inline-block;
    content: " ";
    width: 12px;
    height: 4px;
    border: 1px solid #fff;
    border-top: none;
    border-right: none;
    transform: rotate(-45deg);
    position: absolute;
    top: 5px;
    left: 3px;
    opacity: 0;
  }
  /* 设置选中后背景色 */
  // input:checked + label {
  //   background: #2eb5f0;
  // }
  /* 设置选中后显示 */
  input:checked + label::before {
    opacity: 1;
    transform: all 0.5s;
  }
}
</style>