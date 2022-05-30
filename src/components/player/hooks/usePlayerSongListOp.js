import { computed } from 'vue'
import { useStore } from 'vuex'
import { download } from '@/utils/utils'

export default function usePlayerSongListOp() {
    // vuex
    const store = useStore()
    const playList = computed(() => store.getters.getPlayList);

    // methods
    // 1.清空播放列表
    const clearPlayList = () => {
        store.dispatch('clearPlayerPlayList')
    }

    // 获取所有checked的歌曲id
    const getAllCheckedId = () => {
        const willDeleteArr = []
        playList.value.forEach(s => {
            if (s.checked) {
                willDeleteArr.push(s.id)
            }
        })
        return willDeleteArr
    }

    // 获取所有checked的歌曲的url和歌曲名
    const getAllCheckedUrlAndName = () => {
        const urlAndNameArr = []
        playList.value.forEach(s => {
            if (s.checked) {
                urlAndNameArr.push({ url: s.url, name: s.detail?.songInfo?.name })
            }
        })
        return urlAndNameArr
    }

    // 2.批量删除选中的歌曲
    const batchDeletion = () => {
        const ids = getAllCheckedId()
        store.dispatch('batchDeleteSong', ids)
    }

    // 3.删除歌曲
    const deleteSong=(id)=>{
        store.dispatch('updatePlayerPlayList',{op:1,id})
    }

    // 4.批量下载 
    const batchDownload = () => {
        const urlAndNameArr = getAllCheckedUrlAndName()
        urlAndNameArr.forEach(s => download(s.url, s.name))
    }

    return {
        clearPlayList,
        batchDeletion,
        deleteSong,
        batchDownload,
    }
}