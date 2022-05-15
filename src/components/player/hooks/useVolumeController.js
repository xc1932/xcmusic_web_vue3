import { ref } from 'vue'

export default function useVolumeController() {
    const volume = ref(0.5)
    const cacheVolume = ref(0.5)    //缓存静音前的音量
    const muted = ref(false)

    // 实时获取进度条数据
    const getProcess = function (data) {
        volume.value = data //volume始终根据进度条获取
        if (!muted.value) {
            cacheVolume.value = volume.value //volume的备份 点击muted时不用备份音量 !important
        }
        if (volume.value > 0) {
            muted.value = false
        }
        if (volume.value === 0) {
            muted.value = true
        }

    };

    // 静音事件处理
    const clickHandler = function () {
        if (muted.value && cacheVolume.value === 0) return
        if (muted.value) {//
            // 已经静音,打开音量操作
            volume.value = cacheVolume.value
            muted.value = false
        } else {
            // 未静音,音静音操作
            volume.value = 0
            muted.value = true
        }
    }

    return {
        getProcess,
        volume,
        muted,
        clickHandler,
        cacheVolume
    }
}