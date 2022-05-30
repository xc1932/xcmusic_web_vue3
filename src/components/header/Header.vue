<template>
  <div class="header-container">
    <div class="container">
      <div class="left">
        <div class="btn pre-btn" v-clickZoomOut @click="prePage">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-arrowleft"></use>
          </svg>
        </div>
        <div class="btn next-btn" v-clickZoomOut @click="nextPage">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-arrowright"></use>
          </svg>
        </div>
      </div>
      <div class="center">
        <ul>
          <router-link to="/"><li v-clickZoomOut>首页</li></router-link>
          <router-link to="/"><li v-clickZoomOut>发现</li></router-link>
          <router-link to="/mymusic"
            ><li v-clickZoomOut>音乐盒</li></router-link
          >
        </ul>
      </div>
      <div class="right">
        <div class="search">
          <span class="iconfont icon-search"></span>
          <input
            type="text"
            :placeholder="defaultSearchKeywords"
            v-model="keywords"
            @input="inputHandler"
            @blur="blurHandler"
            @keydown.enter="searchHandler"
          />
        </div>

        <div class="user" @click.stop="showDropdown">
          <div v-if="getUserAvatarUrl" v-mousehoverZoom>
            <img :src="getUserAvatarUrl" />
          </div>
          <svg class="icon" aria-hidden="true" v-else>
            <use xlink:href="#icon-user"></use>
          </svg>
          <div
            class="dropdown"
            v-if="dropdownShow"
            v-clickOutside="closeDropdown"
          >
            <ul>
              <li v-clickZoomOut:[0.95]>
                <span class="iconfont icon-settings4"></span>设置
              </li>
              <li v-clickZoomOut:[0.95] @click="logOut" v-if="getUserAvatarUrl">
                <span class="iconfont icon-login"></span>退出登录
              </li>
              <li v-clickZoomOut:[0.95] @click.stop="showLogin" v-else>
                <span class="iconfont icon-login"></span>登录
              </li>
              <li v-clickZoomOut:[0.95]>
                <span class="iconfont icon-github_alt"></span>GitHub仓库
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { logoutAndClearCookies } from "@/utils/cookie";
import {
  getDefaultSearchKeywords,
  getSearchSuggest,
  getSearchResult,
  getCloudSearchResult,
  getHotSearch,
  getHotSearchDetail,
} from "@/api/search";
import { mapGetters } from "vuex";
export default {
  name: "Header",
  data() {
    return {
      // 默认搜索关键词
      defaultSearchKeywords: "",
      // 搜索关键词
      keywords: "",
      // 下拉菜单显示隐藏控制
      dropdownShow: false,
    };
  },
  computed: {
    ...mapGetters(["getUserNickname", "getUserAvatarUrl"]),
  },
  created() {
    this.getDefaultKeywords();
  },
  methods: {
    searchHandler() {
      let keywords = this.keywords.trim();
      if (keywords === "") {
        keywords = this.defaultSearchKeywords;
      }
      this.$router.push(`/search/${keywords}`);
    },
    inputHandler() {
      const keywords = this.keywords;
      getSearchSuggest({ keywords }).then((res) => {
        // console.log(res);
      });
    },
    blurHandler() {
      let keywords = this.keywords.trim();
      if (keywords === "") {
        this.getDefaultKeywords();
      }
    },
    // 获取默认搜索关键词
    getDefaultKeywords() {
      getDefaultSearchKeywords().then((res) => {
        if (res.code === 200) {
          this.defaultSearchKeywords = res.data.showKeyword;
        }
      });
    },
    // 显示下拉菜单的回调
    showDropdown() {
      this.dropdownShow = true;
    },
    // 关闭下拉菜单的回调
    closeDropdown() {
      this.dropdownShow = false;
    },
    // 显示登录框
    showLogin() {
      this.$store.commit("SET_SHOWLOGINBOX", true);
      this.closeDropdown();
    },
    // 退出登录
    logOut() {
      logoutAndClearCookies();
    },
    // 上一页
    prePage() {
      this.$router.back();
    },
    // 下一页
    nextPage() {
      this.$router.forward();
    },
  },
};
</script>

<style lang='scss' scoped>
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  border-bottom: 1px solid #eee;
  height: 75px;
  @include bg-frostedglass($bgc: rgba(255, 255, 255, 0.8), $blur: 10px);
  .container {
    height: 100%;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      .btn {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
          background-color: rgba(128, 128, 128, 0.3);
        }
      }
      .pre-btn {
        margin-right: 10px;
      }
      svg {
        width: 24px;
        height: 24px;
      }
    }
    .center {
      ul {
        height: 100%;
        margin-bottom: 0;
        display: flex;
        a {
          li {
            height: 50px;
            line-height: 50px;
            padding: 0 15px;
            margin-left: 15px;
            border-radius: 10px;
            font-size: $font-size-large-x;
            font-weight: 700;
            color: black;
            @include not-allowed-select;
            &:hover {
              background-color: rgba(128, 128, 128, 0.3);
            }
          }
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      .search {
        position: relative;
        span {
          position: absolute;
          top: 50%;
          transform: translate(5px, -50%);
        }
        input {
          width: 200px;
          height: 33px;
          border-radius: 10px;
          padding-left: 35px;
          margin-right: 10px;
          outline: 1px solid $color-bg-gray;
          background-color: $color-bg-white;
          &::placeholder {
            color: gray;
          }
        }
      }
      .user {
        position: relative;
        width: 30px;
        height: 30px;
        border-radius: 5px;
        &:hover {
          cursor: pointer;
        }
        svg,
        img {
          width: 30px;
          height: 30px;
        }
        img {
          border-radius: 50%;
          outline: 2px solid rgba(128, 128, 128, 0.3);
        }
        .dropdown {
          width: 150px;
          border-radius: 10px;
          background-color: $color-bg-white;
          transition: all 10s;
          position: absolute;
          left: 0;
          top: 0;
          transform: translate(15px, 15px);
          ul {
            padding: 0 10px;
            margin-bottom: 0;
            text-align: left;
            li {
              padding: 8px;
              border-radius: 5px;
              span {
                margin-right: 5px;
                vertical-align: sub;
              }
              &:hover {
                background-color: $color-bg-gray;
              }
            }
          }
        }
      }
    }
  }
}
</style>
