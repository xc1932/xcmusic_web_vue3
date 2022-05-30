<template>
  <div
    class="mvshowsection"
    v-if="finalMvlist.length > 0"
    ref="mvShowSectionRef"
  >
    <div class="header" v-if="title">
      <div class="title">{{ title }}</div>
      <div
        class="showmoreBtn"
        v-show="!hasShowMore && mvlist.length > 10"
        @click.stop="showMore"
      >
        显示更多
      </div>
    </div>
    <div class="body">
      <div
        class="mvItem"
        v-for="mv in finalMvlist"
        :key="mv.id"
        @click.stop="toMView(mv.id)"
      >
        <div class="cover">
          <div class="mvPlayBtn">
            <play-btn></play-btn>
          </div>
          <img v-lazy="mv.mvCover" />
        </div>
        <div class="desc">
          <div class="mvName textoverflow-hidden-single">{{ mv.mvName }}</div>
          <div class="mvPublishTime">{{ mv.mvPublishTime }}</div>
        </div>
      </div>
    </div>
    <div class="foldBtn" v-show="hasShowMore" @click.stop="fold">收起</div>
  </div>
</template>

<script>
import PlayBtn from "@/components/base/PlayBtn.vue";
import { useRouter } from "vue-router";
import { ref, toRefs, watch } from "vue";
export default {
  name: "MvShowSection",
  components: { PlayBtn },
  props: {
    mvlist: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
    },
  },
  setup(props, { emit }) {
    // router
    const router = useRouter();

    // data
    const { mvlist } = toRefs(props);
    const mvShowSectionRef = ref(null);
    const hasShowMore = ref(false);
    const finalMvlist = ref([]);

    //watch
    watch(
      mvlist,
      (newVal) => {
        finalMvlist.value = newVal.slice(0, 10);
      },
      { immediate: true }
    );

    // methods
    // 1.展开、折叠方法
    const showMore = () => {
      finalMvlist.value = mvlist.value;
      hasShowMore.value = true;
      mvShowSectionRef.value.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };
    const fold = () => {
      finalMvlist.value = mvlist.value.slice(0, 10);
      hasShowMore.value = false;
      mvShowSectionRef.value.scrollIntoView({
        block: "start",
      });
    };
    // 2.跳转到专辑页面
    const toMView = (mvId) => {
      router.push(`/mv/${mvId}`);
    };

    return {
      // data
      mvShowSectionRef,
      mvlist,
      finalMvlist,
      hasShowMore,
      // methods
      showMore,
      fold,
      toMView,
    };
  },
};
</script>

<style lang='scss' scoped>
.mvshowsection {
  @include not-allowed-select;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 20px;
    height: 50px;
    .title {
      font-size: 22px;
      font-weight: 700;
    }
    .showmoreBtn {
      color: #888;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      &:hover {
        color: #666;
      }
    }
  }
  .body {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    width: 1215px;
    .mvItem {
      width: 230px;
      margin: 0 12px 20px 0;
      .cover {
        position: relative;
        border-radius: 15px;
        overflow: hidden;
        transition: all 0.4s ease;
        &:hover {
          box-shadow: -4px 4px 15px 2px rgba(0, 0, 0, 0.2);
        }
        .mvPlayBtn {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          width: 50px;
          height: 50px;
        }
        img {
          width: 230px;
          height: 130px;
          transition: all 0.4s ease;
        }
      }
      .desc {
        .mvName {
          font-size: 16px;
          font-weight: 700;
        }
        .mvPublishTime {
          color: #666;
          font-size: 12px;
          font-weight: 500;
        }
      }
    }
  }
  .foldBtn {
    color: #888;
    font-size: 14px;
    font-weight: 700;
    text-align: right;
    cursor: pointer;
    &:hover {
      color: #666;
    }
  }
}
</style>