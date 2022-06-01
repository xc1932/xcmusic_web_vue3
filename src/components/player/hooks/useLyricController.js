import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default function useLyricController(lyricScollerRef, startScrollLine) {
    // data
    const lyricArr = ref([])
    const curLine = ref(0)

    // vuex
    const store = useStore()
    const lyric = computed(() => store.getters.getLyric)
    const curSong = computed(() => store.getters.getCurSong)
    const playProcess = computed(() => store.getters.getPlayProcess)
    const playing = computed(() => store.getters.getPlaying);

    // watch
    // 1.监听新歌词并处理
    watch(lyric, (newLyric) => {
        if (newLyric.lyric == null) return
        fillLyricArr(newLyric.lyric, newLyric.tlyric);
    })

    // 2.lyricArr丢失后(开发时热跟新),如果用户继续点击播放重新获取歌词 
    watch(playing, (newPlaying) => {
        if (newPlaying && lyricArr.value.length === 0 && lyric.value !== undefined) {
            fillLyricArr(lyric.value.lyric, lyric.value.tlyric);
        }
    })

    // 3.监听播放进度计算对应的歌词行数
    watch(playProcess, (newPlayProcess) => {
        if (newPlayProcess === 0) curLine.value = 0
        const songDuration = curSong.value.detail?.songInfo.dt//ms
        const curTime = songDuration * newPlayProcess//ms
        const index = findLyricIndex(curTime, newPlayProcess)
        index !== -1 ? curLine.value = index : ''
    })

    // methods
    // 1.处理歌词获取歌词数组的方法
    // 根据进度计算应该播放哪条歌词 
    function findLyricIndex(curTime, newProcess) {
        // console.log(lyricArr.value);   
        let resIndex = lyricArr.value.findIndex(item => {
            const itemTime = item.startTime
            const diff = itemTime - curTime
            if (diff > 0 && diff < 500) {
                return true
            }
        })
        resIndex === -1 ? resIndex = findLyricIndexRoughly(newProcess) : ''
        return resIndex
    }

    // 找到两个相邻的[xx:xx.xxx]之间的位置返回靠前的位置 
    function findLyricIndexRoughly(newProcess) {
        const songDuration = curSong.value.detail?.songInfo.dt//ms
        const curTime = songDuration * newProcess//ms
        let resIndex = -1
        for (let i = 0; i < lyricArr.value.length - 1; i++) {
            const pre = lyricArr.value[i]
            const next = lyricArr.value[i + 1]
            if (curTime >= pre.startTime && curTime < next.startTime) {
                resIndex = i
            }
        }
        if (curTime >= lyricArr.value[lyricArr.value.length - 1]?.startTime) {
            resIndex = lyricArr.value.length - 1
        }
        return resIndex
    }

    // fill lyricArr
    function fillLyricArr(lyric, tlyric) {
        const lyricObj = lyricToObj(lyric)
        const tlyricObj = lyricToObj(tlyric)
        if (tlyricObj) {
            for (let key in tlyricObj) {
                lyricObj[key] && (lyricObj[key].tlyricDesc = tlyricObj[key].lyricDesc)
            }
        }
        // 填充歌词数组
        lyricArr.value = []
        for (let key in lyricObj) {
            lyricObj[key].startTime *= 1000
            lyricArr.value.push(lyricObj[key])
        }
        // 根据歌词顺序进行排序
        lyricArr.value.sort((a, b) => a.startTime - b.startTime)
    }

    // lyric -> Obj
    function lyricToObj(lyric) {
        if (lyric === '' || lyric == null) return
        const obj = {}
        const lyricArr = lyric.split('\n')
        lyricArr.forEach(line => {
            const lyricLineObj = lyricLineToObj(line)
            if (lyricLineObj) {
                const { startTime, startTimeStr, lyricDesc } = lyricLineObj
                if (lyricDesc !== '') {
                    obj[startTimeStr] = { startTime, startTimeStr, lyricDesc }
                }
            }
        })
        return obj
    }

    // [02:25.985]sadaadadadsa| -> 
    // {
    // startTime: 145.985, 
    // startTimeStr: '[02:25.985]', 
    // lyricDesc: 'sadaadadadsa'|''
    // }
    function lyricLineToObj(lyricLine) {
        if (lyricLine === '') return
        let lyricLineArr = lyricLine.split(']')
        if (lyricLineArr[1] === undefined) return
        const startTimeStr = lyricLineArr[0] += ']'
        const startTime = startTimeStrToSeconds(startTimeStr)
        const lyricDesc = lyricLineArr[1]
        return {
            startTime, startTimeStr, lyricDesc
        }
    }

    // [xx:xx.xxx|xx] -> 秒数
    function startTimeStrToSeconds(startTimeStr) {
        const timeArr = startTimeStr.substring(1, startTimeStr.length - 1).split(':')
        const mins = new Number(timeArr[0]).valueOf()
        const secs = new Number(timeArr[1]).valueOf()
        const res = parseFloat((60 * mins + secs).toFixed(2))
        return res
    }

    return {
        lyricArr,
        curLine,
        findLyricIndexRoughly,
        lyricToObj
    }
}