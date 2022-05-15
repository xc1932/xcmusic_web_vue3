<template>
  <teleport to="body">
    <div class="login-container">
      <header>
        登录
        <div class="close" @click="closeLogin">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-icon-"></use>
          </svg>
        </div>
      </header>
      <section>
        <main>
          <phone-login
            v-show="loginMethods === 0"
            ref="phoneLoginCom"
            :checkItems="checkItems"
          />
          <email-login v-show="loginMethods === 1" />
          <q-r-code-login v-show="loginMethods === 2" />
          <div class="tips">
            <input type="checkbox" v-model="checkItems" />&nbsp;同意<a href="#"
              >《服务条款》</a
            ><a href="#">《隐私条款》</a><a href="#">《儿童隐私政策》</a>
          </div>
        </main>
        <aside>
          <ul>
            <li v-clickZoomOut @click="switchLoginMethods(0)">
              <div>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-phone"></use>
                </svg>
              </div>
              手机登录
            </li>
            <li v-clickZoomOut @click="switchLoginMethods(1)">
              <div>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-WANGYI"></use>
                </svg>
              </div>
              邮箱登录
            </li>
            <li v-clickZoomOut v-notCurrentlySupported>
              <div>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-QQ"></use>
                </svg>
              </div>
              QQ登录
            </li>
            <li v-clickZoomOut v-notCurrentlySupported>
              <div>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-weixin"></use>
                </svg>
              </div>
              微信登录
            </li>
            <li v-clickZoomOut v-notCurrentlySupported>
              <div>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-xinlang"></use>
                </svg>
              </div>
              微博登录
            </li>
          </ul>
          <div class="qrcode" @click="switchLoginMethods(2)"></div>
        </aside>
        <div class="verticalbar"></div>
      </section>
    </div>
    <div class="mask" ref="mask"></div>
  </teleport>
</template>

<script>
import PhoneLogin from "./PhoneLogin.vue";
import EmailLogin from "./EmailLogin.vue";
import QRCodeLogin from "./QRCodeLogin.vue";
export default {
  name: "Login",
  components: { PhoneLogin, EmailLogin, QRCodeLogin },
  data() {
    return {
      // 同意条款
      checkItems: true,
      // 登录方式
      loginMethods: 0,
    };
  },
  mounted() {
    this.wheelHandler = (e) => {
      e.preventDefault();
    };
    this.$refs.mask.addEventListener("wheel", this.wheelHandler);
  },
  beforeUnmount() {
    this.$refs.mask.removeEventListener("wheel", this.wheelHandler);
    delete this.wheelHandler;
  },
  methods: {
    // 关闭登录框
    closeLogin() {
      this.$store.commit("SET_SHOWLOGINBOX", false);
    },
    // 切换登录方式
    switchLoginMethods(loginMethodNum) {
      if (this.checkItems) {
        if (this.loginMethods !== loginMethodNum) {
          this.loginMethods = loginMethodNum;
        } else if (loginMethodNum === 0) {
          // 当注册成功时，点击手机登录可以返回
          this.$refs.phoneLoginCom.cardSwitching(1);
        }
      } else {
        this.$message.warn(
          "请勾选《服务条款》《隐私条款》《儿童隐私条款》",
          0.5
        );
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  margin: auto;
  width: 700px;
  height: 500px;
  border-radius: 10px;
  background-color: #fff;
  overflow: hidden;
  header {
    position: relative;
    padding-left: 15px;
    height: 50px;
    line-height: 50px;
    background-color: $color-bg-gray;
    text-align: left;
    font-size: $font-size-large-x;
    font-weight: 700;
    .close {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 10px;
      width: 34px;
      height: 34px;
      margin: auto;
      // transform: translateY(-50%);
      transition: all 0.5s ease-out;
      &:hover {
        transform: rotate(180deg);
      }
      svg {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 34px;
        height: 34px;
        transform: translate(-50%, -50%);
      }
    }
  }
  section {
    position: relative;
    height: calc(100% - 50px);
    display: flex;
    main {
      position: relative;
      overflow: hidden;
      flex: 1;
      .tips {
        position: absolute;
        bottom: 50px;
        width: 100%;
        text-align-last: center;
        font-size: $font-size-small;
        color: gray;
        input {
          width: 17px;
          height: 17px;
          vertical-align: middle;
        }
        a {
          color: rgb(80, 125, 175);
        }
      }
    }
    aside {
      position: relative;
      width: 250px;
      padding: 40px 0 0 30px;
      ul {
        li {
          display: flex;
          width: 200px;
          height: 55px;
          line-height: 55px;
          padding-left: 20px;
          margin-bottom: 10px;
          border-radius: 35px;
          font-size: $font-size-large;
          font-weight: 500;
          &:hover {
            background-color: $color-bg-gray;
          }
          div {
            position: relative;
            width: 50px;
            height: 50px;
            margin: 2px 15px 0 0;
            border-radius: 50%;
            .icon {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
      }
      .qrcode {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 100px;
        height: 100px;
        background-image: url("@/assets/images/halfqrcode.png");
      }
    }
    .verticalbar {
      position: absolute;
      top: 75px;
      right: 250px;
      height: 250px;
      border-left: 1px solid gray;
    }
  }
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>