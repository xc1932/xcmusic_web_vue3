import { messagebox } from '@/utils/customComponent'
const mutations = {
    // 一、控制类
    SET_SHOWLOGINBOX(state, showLoginBox) {
        state.showLoginBox = showLoginBox
    },
    // 二、信息共享类
    // 1.用户信息
    SET_USERPROFILE(state, { key, value }) {
        state.userData[key] = value
    },

    // 2.Player信息
    // 1.设置currentIndex
    SET_PLAYERCURRENTINDEX(state, newCurrentIndex) {
        state.playerData['currentIndex'] = newCurrentIndex
    },
    // 2.设置播放列表
    SET_PLAYERPLAYLIST(state, newPlayList) {
        state.playerData['playList'] = newPlayList
    },
    UPDATE_PLAYERPLAYLIST(state, { op, id, checked }) {
        // 0:check 1:删除 
        const index = state.playerData['playList'].findIndex(s => s.id === id)
        if (op === 0) {
            if (checked == null) {
                const checked = state.playerData['playList'][index].checked
                state.playerData['playList'][index].checked = !checked
            } else {
                state.playerData['playList'][index].checked = checked
            }
        } else if (op === 1) {
            state.playerData['playList'].splice(index, 1)
        }
    },
    // 更新播放列表的音乐播放地址
    UPDATE_PLAYERPLAYLISTURL(state, newUrls) {
        newUrls.forEach(url => {
            const index = state.playerData['playList'].findIndex(s => s.id === url.id)
            state.playerData['playList'][index].url = url.url
        })
        messagebox.success('播放器歌曲更新完成')
    },
    // 3.设置随机播放列表
    SET_PLAYERSHUFFLEDLIST(state, newShuffledList) {
        state.playerData['shuffledList'] = newShuffledList
    },
    // 4.设置播放状态
    SET_PLAYERPLAYING(state, newPlayingState) {
        state.playerData['playing'] = newPlayingState
    },
    // 5.设置播放模式
    SET_PLAYERPLAYMODE(state, newPlayMode) {
        state.playerData['playMode'] = newPlayMode
    },
    // 6.设置播放进度  
    SET_PLAYERPLAYPROCESS(state, newPlayProcess) {
        state.playerData['playProcess'] = newPlayProcess
    },
    // 7.设置当前歌曲的歌词
    SET_PLAYERLYRIC(state, newLyric) {
        state.playerData['lyric'] = newLyric
    },
    // 8.用户设置
    SET_USERSETTING(state, { key, value }) {
        state.userSetting[key] = value
    },

    // 三、信息共享类
    // 1.设置likedSongs
    SET_LIKEDSONGS(state, newLikedSongs) {
        state.userLikedMusicData['likedSongs'] = newLikedSongs
    },
    UPDTAE_LIKEDSONGS(state, { op, newId }) {
        // 0:增加 1:删除
        if (op === 0) {
            state.userLikedMusicData['likedSongs'].push(newId)
        } else if (op === 1) {
            const likedSongs = state.userLikedMusicData['likedSongs']
            const index = likedSongs.findIndex(id => id === newId)
            if (index !== -1) {
                likedSongs.splice(index, 1)
            }
        }

    },
    SET_LIKEDSONGSWITHDETAIL(state, newLikedSongsWidthDetail) {
        state.userLikedMusicData['likedSongsWithDetail'] = newLikedSongsWidthDetail
    },
    SET_LIKEDPLAYLISTS(state, newLikedPlayLists) {
        state.userLikedMusicData['likedPlayLists'] = newLikedPlayLists
    },
    SET_LIKEDALBUMS(state, newLikedAlbums) {
        state.userLikedMusicData['likedAlbums'] = newLikedAlbums
    },
    SET_LIKEDARTISTS(state, newLikedArtists) {
        state.userLikedMusicData['likedArtists'] = newLikedArtists
    },
    SET_LIKEDMVS(state, newLikedMVs) {
        state.userLikedMusicData['likedMVs'] = newLikedMVs
    },
    SET_LIKEDCLOUDDISK(state, newLikedCloudDisk) {
        state.userLikedMusicData['likedCloudDisk'] = newLikedCloudDisk
    },

}
export default mutations