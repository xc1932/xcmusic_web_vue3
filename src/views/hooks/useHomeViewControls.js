import { useStore } from 'vuex'
import { getSongUrl, getSongDetail } from '@/api/song'
import { isTrackPlayable } from '@/utils/utils'

export default function useHomeViewControls() {
    // vuex
    const store = useStore()
    // methods
    // 1.playlist controls
    // 播放歌单歌曲
    const playAllSongInPlaylist = (playlist) => {
        if (playlist.trackCount <= 0) {
            messagebox.warn("没有歌曲");
            return;
        }
        store.dispatch("getPlaylistSongsAndPlay", playlist.id);
    }

    // 2.album controls
    // 播放专辑中的全部歌曲
    const playAllSongInAlbum = (album) => {
        if (album.size <= 0) {
            messagebox.warn('专辑中没有歌曲')
            return
        }
        store.dispatch('getAlbumSongsAndPlay', album.id)
    }

    // 3.artists controls
    // 播放歌手的全部单曲
    const playAllSongOfArtist = (id) => {
        store.dispatch('getArtistSongsAndPlay', id)
    }

    // 获取歌曲的完整信息 
    const accessCompleteDataOfSongs = (idsArr, target) => {
        if (idsArr <= 0) return
        let newPlayList = []
        // 1.拼接id,同时获取列表中所有歌曲的数据
        const ids = idsArr.join(',')
        // 2.1获取歌曲详情
        const details = getSongDetail({ ids })
        // 2.1获取歌曲url
        const urls = getSongUrl({ id: ids })
        // 3.使用Promise.all同时发送以上请求,
        // 优点：可以在两个请求都成功后处理，有一个请求失败就处理。
        Promise.all([details, urls])
            .then(res => {
                const detailsRes = res[0]
                const urlsRes = res[1]
                if (detailsRes.code === 200 && urlsRes.code === 200) {
                    // 将成功响应的数据,重新组合成数组
                    const songs = detailsRes.songs
                    const privileges = detailsRes.privileges
                    const urls = urlsRes.data
                    if (songs.length <= 0 || privileges.length <= 0 || urls.length <= 0 || songs.length !== urls.length) {
                        message.warning('歌曲列表获取失败!')
                        return
                    }
                    songs.forEach((song, index) => {
                        // urls和songs、privileges循序不一致
                        const urlItem = urls.find(item => item.id === song.id)
                        newPlayList.push({
                            id: song.id,
                            detail: {
                                songInfo: song,
                                privilege: privileges[index]
                            },
                            url: urlItem.url,
                            checked: false,
                            playable: isTrackPlayable({
                                songInfo: song,
                                privilege: privileges[index]
                            })
                        })
                    })
                    target.value = newPlayList
                } else {
                    message.warning('歌曲列表获取失败!')
                }
            }, err => {
                console.log(err);
            })
    }
    return {
        // methods
        playAllSongInPlaylist,
        playAllSongInAlbum,
        playAllSongOfArtist,
        accessCompleteDataOfSongs
    }
}