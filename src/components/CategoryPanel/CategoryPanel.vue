<template>
  <div class="CategoryPanel">
    <div
      class="primaryCategory"
      v-for="(cat, index) in categoryObj.categories"
      :key="index"
    >
      <div class="left">
        <div class="primaryDesc">{{ cat }}</div>
      </div>
      <div class="right">
        <div
          class="secondaryCategory"
          v-for="sub in categoryObj.subs.filter((s) => s.category == index)"
          :key="sub.name"
        >
          <div
            class="secondaryDesc"
            :class="{ selected: selectedCatArr.includes(sub.name) }"
            v-clickZoomOut:[0.95]
            @click.stop="select(sub.name)"
          >
            {{ sub.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  name: "CategoryPanel",
  props: {
    categoryObj: {
      type: Object,
    },
  },
  setup(props) {
    // vuex
    const store = useStore();
    const selectedCatArr = computed(
      () => store.getters.getUserSelectedCategories
    );

    // methods
    // 选中或删除一个类别
    const select = (catName) => {
      let newSelectedCatArr = null;
      if (selectedCatArr.value.includes(catName)) {
        newSelectedCatArr = selectedCatArr.value.filter((c) => c !== catName);
      } else {
        newSelectedCatArr = [...selectedCatArr.value, catName];
      }
      store.dispatch("setUserSelectedCategories", newSelectedCatArr);
    };
    return {
      //vuex
      selectedCatArr,
      // methods
      select,
    };
  },
};
</script>

<style lang='scss' scoped>
.CategoryPanel {
  padding: 20px;
  width: 1200px;
  border-radius: 20px;
  line-height: 1;
  background-color: #eee;
  backdrop-filter: blur(2px);
  @include not-allowed-select;
  .primaryCategory:last-child {
    margin-bottom: 0;
  }
  .primaryCategory {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;
    .left {
      width: 80px;
      height: 100%;
      .primaryDesc {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        margin-top: 8px;
        width: 100%;
        font-size: 26px;
        font-weight: 700;
      }
    }
    .right {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      width: 1080px;
      .secondaryCategory {
        display: flex;
        min-width: 108px;
        .selected {
          color: #3359d4;
        }
        .secondaryDesc {
          padding: 0 15px;
          height: 40px;
          line-height: 40px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          &:hover {
            background-color: #fff;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>