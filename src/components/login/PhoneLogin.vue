<template>
  <div class="phonelogin-container" ref="loginContainerRef">
    <div class="left">
      <div class="back" v-clickZoomOut @click="cardSwitching(1)">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-fanhui"></use>
        </svg>
        返回
      </div>
      <div class="line1">
        <select name="" id="">
          <option value="">+86</option>
        </select>
        <input type="number" placeholder="请输入手机号" v-model="phoneNumber" />
      </div>
      <div class="line2">
        <div class="password" v-if="passwordLogin">
          <input type="password" placeholder="请输入密码" v-model="password" />
        </div>
        <div class="shortMg" v-else>
          <input type="text" placeholder="请输入验证码" v-model="captcha" />
          <button @click="getCaptcha">获取验证码</button>
        </div>
      </div>
      <div class="line3">
        <span @click="toShortMsgLogin" v-show="passwordLogin">短信登录</span>
        <span @click="toPasswordLogin" v-show="!passwordLogin">密码登录</span>
        <div class="line3right">
          <input type="checkbox" />
          <span>自动登录</span>
        </div>
      </div>
      <div class="line4">
        <button
          @click="passwordLogin ? loginWithPassword() : loginWithShortMsg()"
        >
          登录
        </button>
      </div>
    </div>
    <div class="center">
      <div class="img">
        <img src="@/assets/images/login.png" alt="" />
      </div>
      <div class="btns">
        <button class="btn loginbtn" v-clickZoomOut @click="cardSwitching(0)">
          手机号登录
        </button>
        <button
          class="btn registerbtn"
          v-clickZoomOut
          v-notCurrentlySupported
        >
          注册
        </button>
      </div>
    </div>
    <div class="right">
      <div class="back" v-clickZoomOut @click="cardSwitching(1)">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-fanhui"></use>
        </svg>
        返回
      </div>
      <div class="line">
        <select name="" id="">
          <option value="">+86</option>
        </select>
        <input type="text" placeholder="请输入手机号 " />
      </div>
      <div class="line">
        <input type="password" placeholder="设置登录密码，不少于8位" />
      </div>
      <div class="line noborder">
        <button @click="nextStep1">下一步</button>
      </div>
    </div>
    <div class="right2">
      <div class="back" v-clickZoomOut @click="cardSwitching(1)">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-fanhui"></use>
        </svg>
        返回
      </div>
      <div class="line1">
        <p class="topp">您的手机号:<span> +86 {{}}</span></p>
        <p>为了安全,我们会给您发送短信验证码</p>
      </div>
      <div class="line noborder">
        <input type="text" />
        <span>{{ 50 }}s</span>
        <button class="littlebtn">重新发送</button>
      </div>
      <div class="line noborder">
        <button @click="nextStep2">下一步</button>
      </div>
    </div>
    <div class="right3">
      <div class="success">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chenggong"></use>
        </svg>
      </div>
      <p>注册成功</p>
    </div>
  </div>
</template>

<script>
import {
  loginWithPhone,
  checkPhoneRegister,
  getCaptcha,
  verifyCaptcha,
  loginWithCaptcha,
} from "@/api/auth";
import { setCookies } from "@/utils/cookie";
export default {
  name: "PhoneLogin",
  props: ["checkItems"],
  data() {
    return {
      passwordLogin: false,
      phoneNumber: "",
      password: "",
      captcha: "",
    };
  },
  methods: {
    // 1.登录切换
    cardSwitching(cardNum) {
      if ((cardNum === 0 || cardNum === 2) && !this.checkItems) {
        return this.$message.warn(
          "请勾选《服务条款》《隐私条款》《儿童隐私条款》",
          0.5
        );
      }
      const translateLen =
        cardNum === 0 ? "0" : cardNum === 1 ? "-100%" : "-200%";
      this.$refs.loginContainerRef.style.transform = `translateX(${translateLen})`;
    },
    // 2.切换到短信登录
    toShortMsgLogin() {
      this.passwordLogin = false;
    },
    // 3.切换到密码登录
    toPasswordLogin() {
      this.passwordLogin = true;
    },
    // 4.密码登录
    async loginWithPassword() {
      const phoneNumber = (this.phoneNumber + "").trim();
      if (phoneNumber === "") return alert("手机号不能为空!!!");
      const password = this.password.trim();
      const telReg =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (!telReg.test(phoneNumber)) return alert("手机号输入错误!!!");
      // 获取手机后注册状态
      const registerRes = await checkPhoneRegister({
        phone: phoneNumber,
      });
      if (registerRes.exist === -1) return alert("手机号未注册!!!");
      if (password === "") return alert("密码不能为空!!!");
      // 登录
      const loginRes = await loginWithPhone({
        phone: phoneNumber,
        password: password,
      });
      if (loginRes.code === 502) {
        this.password = "";
        return alert("密码错误!!!");
      }
      if (loginRes.code === 250) {
        alert("登录过于频繁,请稍后尝试!!!");
      }
      if (loginRes.code === 200) {
        setCookies(loginRes.cookie);
        this.$store.dispatch("setUserProfile");
        this.$store.commit("SET_SHOWLOGINBOX", false);
      }
      // console.log(loginRes);
    },
    // 7.短信登录(待完成)
    async loginWithShortMsg() {
      if (!this.verifyCaptcha()) return false;
      const captcha = this.captcha.trim();
      const phone = (this.phoneNumber + "").trim();
      const loginRes = await loginWithCaptcha({
        phone,
        captcha,
      });
      if (loginRes.code === 200) {
        setCookies(loginRes.cookie);
        this.$store.dispatch("setUserProfile");
        this.$store.commit("SET_SHOWLOGINBOX", false);
      }
      // console.log(loginRes);
    },
    // 8.获取验证码
    async getCaptcha() {
      const phone = (this.phoneNumber + "").trim();
      if (phone === "") return alert("手机号不能为空!!!");
      const telReg =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (!telReg.test(phone)) return alert("手机号输入错误!!!");
      // 获取手机后注册状态
      const registerRes = await checkPhoneRegister({ phone });
      if (registerRes.exist === -1) return alert("手机号未注册!!!");
      const res = await getCaptcha({ phone });
      if (res.code === 400)
        return alert("发送验证码超过限制:每个手机号一天只能发5条验证码");
      if (res.code === 200) return alert("验证码发送成功");
    },
    // 9.验证验证码
    async verifyCaptcha() {
      const captcha = this.captcha.trim();
      if (!captcha) {
        alert("验证码不能为空");
        return false;
      }
      const phone = (this.phoneNumber + "").trim();
      try {
        const res = await verifyCaptcha({
          phone,
          captcha,
        });
        if (res.code === 200) {
          return true;
        }
      } catch (error) {
        if (error.response.status === 503) {
          return alert("验证码错误");
        }
      }
    },
    // 10.下一步1
    nextStep1() {
      this.$refs.loginContainerRef.style.transform = `translateX(-300%)`;
    },
    // 11.下一步2
    nextStep2() {
      this.$refs.loginContainerRef.style.transform = `translateX(-400%)`;
    },
  },
};
</script>

<style lang='scss' scoped>
.phonelogin-container {
  transform: translateX(-100%);
  height: 350px;
  display: flex;
  flex-wrap: nowrap;
  .left {
    position: relative;
    flex-shrink: 0;
    width: 100%;
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .line1,
    .line2,
    .line3,
    .line4 {
      width: 250px;
      height: 40px;
      margin-bottom: 10px;
    }
    .line1 {
      border: 1px solid gray;
      border-radius: 3px;
      overflow: hidden;
      display: flex;
      select {
        min-width: 55px;
        height: 100%;
        padding-left: 5px;
        border-right: 1px solid gray;
      }
      input {
        flex: 1;
        height: 100%;
        padding-left: 15px;
      }
    }
    .line2 {
      .password {
        position: relative;
        height: 100%;
        input {
          width: 100%;
          height: 100%;
          padding-left: 15px;
          border: 1px solid gray;
          border-radius: 3px;
        }
        &::after {
          content: "忘记密码?";
          display: block;
          position: absolute;
          top: 50%;
          right: 8px;
          transform: translateY(-50%);
          color: gray;
          cursor: pointer;
        }
      }
      .shortMg {
        height: 100%;
        display: flex;
        justify-content: space-between;
        input {
          width: 140px;
          height: 100%;
          padding-left: 15px;
          border: 1px solid gray;
          border-radius: 3px;
        }
        button {
          width: 90px;
          border: 1px solid gray;
          border-radius: 6px;
          &:hover {
            background-color: #e5e5e5;
          }
        }
      }
    }
    .line3 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        height: 30px;
        line-height: 30px;
        cursor: pointer;
      }
      .line3right {
        input {
          height: 17px;
          width: 17px;
          margin-right: 5px;
          vertical-align: middle;
        }
      }
    }
    .line4 {
      button {
        width: 100%;
        height: 100%;
      }
    }
    .back {
      height: 23px;
      line-height: 23px;
      position: absolute;
      top: 295px;
      left: 100px;
    }
  }
  .center {
    flex-shrink: 0;
    width: 100%;
    padding-top: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .btns {
      margin-top: 50px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .btn {
        width: 280px;
        height: 35px;
        line-height: 35px;
        border: none;
        border-radius: 3px;
        box-shadow: 0.5px 0.5px 5px gray;
        font-size: $font-size-normal;
        font-weight: 500;
      }
      .loginbtn {
        margin-bottom: 15px;
        background-color: rgba(87, 169, 37, 1);

        color: #fff;
        &:hover {
          background-color: rgba(87, 169, 37, 0.9);
        }
      }
      .registerbtn {
        background-color: rgba(245, 245, 245);
        &:hover {
          background-color: rgba(250, 250, 250);
        }
      }
    }
  }
  .right {
    position: relative;
    flex-shrink: 0;
    width: 100%;
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .line {
      width: 250px;
      height: 40px;
      margin-bottom: 10px;
      border: 1px solid gray;
      border-radius: 3px;
      overflow: hidden;
      display: flex;
      select {
        min-width: 55px;
        height: 100%;
        padding-left: 5px;
        border-right: 1px solid gray;
      }
      input {
        flex: 1;
        height: 100%;
        padding-left: 15px;
      }
      button {
        width: 100%;
        height: 100%;
      }
    }
  }
  .right2 {
    position: relative;
    flex-shrink: 0;
    width: 100%;
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .line1 {
      width: 250px;
      height: 45px;
      margin-bottom: 20px;
      font-size: $font-size-small;
      color: gray;
      .topp {
        margin-bottom: 7px;
        span {
          color: black;
          font-weight: 900;
        }
      }
    }
    .line {
      width: 250px;
      height: 40px;
      margin-bottom: 10px;
      border: 1px solid gray;
      border-radius: 3px;
      overflow: hidden;
      input {
        flex: 1;
        width: 100px;
        height: 100%;
        padding-left: 15px;
        margin-right: 10px;
        border: 1px solid gray;
        border-radius: 3px;
      }
      span {
        color: gray;
      }
      .littlebtn {
        float: right;
        width: 90px;
      }
      button {
        width: 100%;
        height: 100%;
      }
    }
  }
  .right3 {
    flex-shrink: 0;
    width: 100%;
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .success {
      width: 80px;
      height: 80px;
      margin-bottom: 20px;
      svg {
        width: 100%;
        height: 100%;
      }
    }
    p {
      font-size: $font-size-large-x;
      font-weight: 900;
    }
  }
  .back {
    height: 23px;
    line-height: 23px;
    position: absolute;
    top: 265px;
    left: 100px;
  }
  .noborder {
    border: transparent !important;
  }
}
</style>