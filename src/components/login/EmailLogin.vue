<template>
  <div class="emaillogin-container">
    <input
      type="email"
      placeholder="请输入邮箱"
      v-model="email"
      @blur="checkEmail"
    />
    <input
      type="password"
      placeholder="请输入密码"
      v-model="password"
      @blur="checkPassword"
    />
    <div class="line">
      <div class="left">
        <input type="checkbox" />
        <span>自动登录</span>
      </div>
      <span class="forget">忘记密码?</span>
    </div>
    <button @click="emailLogin">登录</button>
  </div>
</template>

<script>
import { setCookies } from "@/utils/cookie";
import { loginWithEmail } from "@/api/auth";
export default {
  name: "EmailLogin",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    // 1.检查邮箱
    checkEmail() {
      const email = this.email.trim();
      if (!email) return this.$message.warn("邮箱不能为空!");
      if (!email.endsWith("@163.com")) {
        this.email += "@163.com";
      }
    },
    // 2.检查密码 
    checkPassword() {
      const password = this.password.trim();
      if (!password) return this.$message.warn("密码不能为空!");
    },
    // 3.邮箱登录
    async emailLogin() {
      const email = this.email.trim();
      const password = this.password.trim();
      // 检查输入
      let warnMsg = !email ? "邮箱不能为空!  " : "";
      warnMsg += !password ? "密码不能为空!" : "";
      if (warnMsg) return this.$message.warn(warnMsg);
      // 登录
      try {
        const loginRes = await loginWithEmail({
          email,
          password,
        });
        if (loginRes.code === 200) {
          setCookies(loginRes.cookie);
          this.$store.dispatch("setUserProfile");
          this.$store.commit("SET_SHOWLOGINBOX", false);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.emaillogin-container {
  width: 100%;
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  input,
  button {
    width: 250px;
    height: 40px;
  }
  input[placeholder] {
    padding-left: 15px;
    margin-bottom: 10px;
    border: 1px solid gray;
    border-radius: 3px;
  }
  .line {
    width: 250px;
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      input[type="checkbox"] {
        width: 17px;
        height: 17px;
        margin-right: 3px;
      }
    }
    .forget {
      cursor: pointer;
    }
  }
}
</style>