<template>
  <div class="playerSongList">
    <div class="header">
      <ul>
        <li>收藏</li>
        <li>添加到</li>
        <li>下载</li>
        <li>删除</li>
        <li>清空列表</li>
      </ul>
    </div>
    <div class="body">
      <ul>
        <li>
          <div class="checkbox">
            <CheckBoxBC :inputId="0"></CheckBoxBC>
          </div>
          <div class="number dark"></div>
          <div class="songName dark">歌曲</div>
          <div class="singer dark">歌手</div>
          <div class="timer dark">时长</div>
        </li>
        <li>
          <div class="checkbox">
            <CheckBoxBC :inputId="1"></CheckBoxBC>
          </div>
          <div class="number">1</div>
          <div class="songName"><span>漂洋过海来看你 (Live)</span></div>
          <div class="singer"><span>马丽</span></div>
          <div class="timer"><span>05:21</span></div>
        </li>
        <li>
          <div class="checkbox">
            <CheckBoxBC :inputId="1"></CheckBoxBC>
          </div>
          <div class="number">1</div>
          <div class="songName"><span>漂洋过海来看你 (Live)</span></div>
          <div class="singer"><span>马丽</span></div>
          <div class="timer"><span>05:21</span></div>
        </li>
        <li>
          <div class="checkbox">
            <CheckBoxBC :inputId="1"></CheckBoxBC>
          </div>
          <div class="number">1</div>
          <div class="songName"><span>漂洋过海来看你 (Live)</span></div>
          <div class="singer"><span>马丽</span></div>
          <div class="timer"><span>05:21</span></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import CheckBoxBC from "@/components/base/CheckBoxBC.vue";
export default {
  name: "PlayerSongList",
  components: { CheckBoxBC },
};
</script>

<style lang="scss" scoped>
.playerSongList {
  color: #fff;
  height: 100%;
  .header {
    height: 50px;
    ul {
      height: 100%;
      padding-left: 15px;
      display: flex;
      align-items: center;
      li {
        width: 130px;
        height: 40px;
        line-height: 38px;
        border: 1px solid #fff;
        margin-right: 10px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        opacity: 0.5;
        &:hover {
          opacity: 1;
        }
        transition: opacity 0.2s ease;
        cursor: pointer;
      }
    }
  }
  .body {
    height: calc(100% - 50px);
    ul {
      height: 100%;
      padding: 20px 0 0 15px;
      li {
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        // border: 1px solid #fff;
        .dark {
          opacity: 0.5;
          cursor: default;
        }
        .songName,
        .singer,
        .timer {
          span {
            opacity: 0.5;
            transition: opacity 0.2s ease;
            cursor: pointer;
            &:hover {
              opacity: 1;
            }
          }
        }
        .number {
          opacity: 0.5;
          cursor: default;
        }
        .checkbox {
          width: 5%;
          height: 20px;
        }
        .number {
          width: 5%;
          padding-right: 15px;
          text-align: right;
        }
        .songName {
          width: 60%;
        }
        .singer {
          width: 20%;
        }
        .timer {
          width: 10%;
          text-align: center;
        }
      }
    }
  }
}
</style>