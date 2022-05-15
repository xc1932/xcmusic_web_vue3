<template>
  <div class="qrcodelogin-container">
    <div class="left">
      <img src="@/assets/images/qrcodelogin.png" />
    </div>
    <div class="right">
      <h2>扫码登录</h2>
      <div class="qrcode">
        <img :src="qrImg" />
      </div>
      <p>使用<a href="javascript:void 0;">网易云音乐APP</a>扫码登录</p>
    </div>
  </div>
</template>

<script>
import { getqrKey, getqrInfo, checkQRStatus } from "@/api/auth";
import { setCookies } from "@/utils/cookie";
export default {
  name: "QRCodeLogin",
  data() {
    return {
      key: "",
      qrImg: "",
      loginStatus: false,
    };
  },
  created() {
    this.getQRInfo();
    this.timer = setInterval(() => {
      this.checkQRStatus();
    }, 1000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
    delete this.timer;
  },
  methods: {
    // 获取二维码
    async getQRInfo() {
      const res = await getqrKey();
      if (res.code === 200) {
        this.key = res.data.unikey;
      } else {
        this.getQRInfo();
        return this.$message.error("获取验证码失败,重新获取二维码!");
      }
      const qrInfo = await getqrInfo({
        key: this.key,
        qrimg: "qrimg",
      });
      if (qrInfo.code === 200) {
        this.qrImg = qrInfo.data.qrimg;
      } else {
        this.$message.error("获取验证码失败,重新获取二维码!");
        this.getQRInfo();
      }
    },
    // 检查验证码状态
    async checkQRStatus() {
      let loginStatus = await checkQRStatus({ key: this.key });
      if (loginStatus.code === 800 && !this.loginStatus && this.qrImg) {
        this.$message.info("二维码过期,重新获取二维码!");
        this.key = "";
        this.qrImg = "";
        this.getQRInfo();
      }
      if (loginStatus.code === 803) {
        this.loginStatus = true;
        this.$message.success("二维码登陆成功!");
        setCookies(loginStatus.cookie);
        this.$store.dispatch("setUserProfile");
        this.$store.commit("SET_SHOWLOGINBOX", false);
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.qrcodelogin-container {
  padding-top: 50px;
  display: flex;
  justify-content: center;
  .left {
    width: 150px;
    height: 267px;
    margin-right: 20px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .right {
    padding-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    h2 {
      margin-bottom: 20px;
      font-size: $font-size-large;
      font-weight: 500;
    }
    .qrcode {
      width: 130px;
      height: 130px;
      margin-bottom: 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    p {
      color: gray;
      a {
        color: #0c73c2;
        text-decoration: none;
      }
    }
  }
}
</style>