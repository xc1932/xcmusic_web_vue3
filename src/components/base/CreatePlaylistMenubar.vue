<template>
  <div
    class="createPlaylistMenubar"
    ref="createPlaylistMenubarRef"
    :style="createPlaylistMenubarStyle"
  >
    <div class="header">新建歌单</div>
    <div class="body">
      <label for="newplaylistInput">歌单名</label>
      <input type="text" id="newplaylistInput" v-model="newPlaylistName" />
    </div>
    <div class="btns">
      <div class="left">
        <input type="checkbox" id="privacyId" v-model="checked" />
        <label for="privacyId">设置为隐私歌单</label>
      </div>
      <div class="right">
        <div class="btn cancel" @click.stop="closeMenubar">取消</div>
        <div class="btn confirm" @click.stop="createNewPlaylist">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import { createPlaylist } from "@/api/user";
import { messagebox } from "@/utils/customComponent";
import { useStore } from "vuex";
import { ref, toRefs, computed } from "vue";
export default {
  name: "CreatePlaylistMenubar",
  props: {
    menubarTop: {
      type: Number,
      default: 0,
    },
    menubarLeft: {
      type: Number,
      default: 0,
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    // data
    const { menubarTop, menubarLeft } = toRefs(props);
    const createPlaylistMenubarRef = ref(null);
    const newPlaylistName = ref("");
    const checked = ref(false);

    // vuex
    const store = useStore();
    const userId = computed(() => store.getters.getUserID);

    // computed
    const createPlaylistMenubarStyle = {
      top: menubarTop.value + "px",
      left: menubarLeft.value + "px",
    };

    // methods
    // 1.关闭createPlaylistMenubar
    const closeMenubar = () => {
      emit("close", false);
    };
    // 2.创建新歌单
    const createNewPlaylist = async () => {
      const newPlaylist = newPlaylistName.value.trim();
      if (newPlaylist === "") {
        messagebox.warn("请输入歌单名");
      } else {
        // 关闭createPlaylistMenubar
        closeMenubar();
        let params = { name: newPlaylist };
        if (checked.value) {
          params = { ...params, privacy: "10" };
        }
        const res = await createPlaylist(params);
        if (res.code === 200) {
          messagebox.success("创建成功");
          //重新拉取用户歌单数据
          store.dispatch("setUserLikedMusicData", userId.value);
        } else {
          messagebox.warn("创建失败");
          console.log(res);
        }
      }
    };
    return {
      // data
      createPlaylistMenubarRef,
      newPlaylistName,
      checked,
      // computed
      createPlaylistMenubarStyle,
      // methods
      closeMenubar,
      createNewPlaylist,
    };
  },
};
</script>

<style lang='scss' scoped>
.createPlaylistMenubar {
  position: fixed;
  z-index: 10000;
  width: 450px;
  height: 200px;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  .header {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eee;
    font-size: 22px;
    font-weight: 600;
    text-align: center;
  }
  .body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90px;
    label {
      font-size: 18px;
      font-weight: 500;
    }
    input {
      margin: 3px 0 0 15px;
      padding-left: 10px;
      width: 300px;
      height: 35px;
      border: 1px solid #aaa;
      border-radius: 5px;
    }
  }
  .btns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    .left {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding-bottom: 15px;
      height: 100%;
      input[type="checkbox"] {
        margin-left: 40px;
        width: 15px;
        height: 15px;
        vertical-align: middle;
      }
      label {
        margin-left: 5px;
        height: 15px;
        line-height: 15px;
        font-size: 14px;
      }
    }
    .right {
      display: flex;
      align-items: center;
      height: 100%;
      .btn {
        margin-right: 10px;
        width: 100px;
        height: 40px;
        line-height: 40px;
        border-radius: 5px;
        font-size: 18px;
        font-weight: 500;
        text-align: center;
      }
      .cancel {
        border: 1px solid #aaa;
        &:hover {
          background-color: #ededed;
        }
      }
      .confirm {
        color: #fff;
        background-color: #31c27c;
        &:hover {
          background-color: #2caf6f;
        }
      }
    }
  }
}
</style>