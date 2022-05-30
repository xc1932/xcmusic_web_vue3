import { isLoggedIn } from './cookie'
import store from '@/store'

// 1.生成一个长度为n，元素为 < n 的不重复索引的随机数组。
export function createRandomIndexArr(n) {
  if (n === 0) return undefined
  if (n === 1) return [0]
  const resArr = []
  // 填充一个有序数组
  for (let i = 0; i < n; i++) {
    resArr[i] = i
  }
  return shuffle(resArr)
}

// 2.打乱一个数组
export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (1 + i))
    swap(arr, i, randomIndex)
  }
  return arr
}

// 交换数组中的两个元素
function swap(arr, index1, index2) {
  let temp = arr[index1]
  arr[index1] = arr[index2]
  arr[index2] = temp
}

// 3.时间转换(毫秒->m:s)
export function timeTransform(time) {
  if (time == null || isNaN(time)) return
  const totalSeconds = Math.floor(time / 1000)
  const m = new String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const s = new String(totalSeconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

// 4.文件下载 
export function download(filePath, fileName) {
  fetch(filePath).then(res => res.blob()).then(blob => {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = fileName ? fileName : filePath
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  })
}

// 5.判断歌曲的播放权限 
export function isTrackPlayable(detail) {
  let result = {
    playable: true,
    reason: '',
  };
  if (detail?.privilege?.pl > 0) {
    return result;
  }
  // cloud storage judgement logic
  if (isLoggedIn() && detail?.privilege?.cs) {
    return result;
  }
  if (detail.songInfo.fee === 1 || detail.privilege?.fee === 1) {
    if (isLoggedIn() && store.getters.getUserVipType === 11) {
      result.playable = true;
    } else {
      result.playable = true;
      result.reason = 'VIP Only';
    }
  } else if (detail.songInfo.fee === 4 || detail.privilege?.fee === 4) {
    result.playable = false;
    result.reason = '付费专辑';
  } else if (
    detail.songInfo.noCopyrightRcmd !== null &&
    detail.songInfo.noCopyrightRcmd !== undefined
  ) {
    result.playable = false;
    result.reason = '无版权';
  } else if (detail.privilege?.st < 0 && isLoggedIn()) {
    result.playable = false;
    result.reason = '已下架';
  }
  return result;
}

// 6.播放量转换函数
export function playCountConvert(playCount) {
  return playCount > 100000000 ? (playCount / 100000000).toFixed(1) + "亿" :
    playCount > 10000000 ? (playCount / 10000000).toFixed(1) + "千万"
      : playCount > 1000000 ? (playCount / 1000000).toFixed(1) + "百万"
        : playCount > 10000 ? (playCount / 10000).toFixed(1) + "万"
          : playCount;
};

