<template>
  <div class="header-container">
    <div class="container">
      <div class="left">
        <div class="btn pre-btn" v-clickZoomOut>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-arrowleft"></use>
          </svg>
        </div>
        <div class="btn next-btn" v-clickZoomOut>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-arrowright"></use>
          </svg>
        </div>
      </div>
      <div class="center">
        <ul>
          <li v-clickZoomOut>首页</li>
          <li v-clickZoomOut>发现</li>
          <li v-clickZoomOut>音乐库</li>
        </ul>
      </div>
      <div class="right">
        <div class="search">
          <span class="iconfont icon-search"></span>
          <input type="text" placeholder="搜索" />
        </div>

        <div class="user" @click="showDropdown" v-clickOutside="closeDropdown">
          <div v-if="getUserAvatarUrl" v-mousehoverZoom>
            <img :src="getUserAvatarUrl" />
          </div>
          <svg class="icon" aria-hidden="true" v-else>
            <use xlink:href="#icon-user"></use>
          </svg>
          <div class="dropdown" v-show="dropdownShow">
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
import { mapGetters } from "vuex";
export default {
  name: "Header",
  data() {
    return {
      // 下拉菜单显示隐藏控制
      dropdownShow: false,
    };
  },
  computed: {
    ...mapGetters(["getUserNickname", "getUserAvatarUrl"]),
  },
  methods: {
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
      this.$store.commit('SET_SHOWLOGINBOX',true)
      this.closeDropdown();
    },    
    // 退出登录
    logOut() {
      logoutAndClearCookies();
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
  height: 75px;
  @include bg-frostedglass();
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
          background-color: $color-bg-white;
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
        li {
          height: 50px;
          line-height: 50px;
          padding: 0 15px;
          margin-left: 15px;
          font-size: $font-size-large-x;
          font-weight: 700;
          border-radius: 10px;
          &:hover {
            background-color: $color-bg-white;
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
          outline: 2px solid rgba(128,128,128,0.3);
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
            padding: 10px;
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
