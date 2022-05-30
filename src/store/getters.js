import { toRaw } from 'vue'
const getters = {
    // 1️一、控制类
    getShowLoginBox(store) {
        return store.showLoginBox
    },

    // 二、信息共享类
    // 1.用户信息
    getUserNickname(state) {
        return state.userData?.profile?.nickname
    },
    getUserAvatarUrl(state) {
        return state.userData?.profile?.avatarUrl
    },
    getUserID(state) {
        return state.userData?.profile.userId
    },
    getUserVipType(state) {
        return state.userData?.profile.vipType
    },
    // 2.Player信息    
    getCurrentIndex(state) {
        return state.playerData.currentIndex
    },
    getPlayList(state) {
        return state.playerData.playList
    },
    getShuffledList(state) {
        return state.playerData.shuffledList
    },
    getCurSong(state) {
        // !important 暂时解除响应式
        const playMode = toRaw(state.playerData).playMode
        if (playMode === 2) {
            return state.playerData?.shuffledList[state.playerData.currentIndex] || {}
        }
        return state.playerData?.playList[state.playerData.currentIndex] || {}
    },
    getPlaying(state) {
        return state.playerData.playing
    },
    getPlayMode(state) {
        return state.playerData.playMode
    },
    getPlayProcess(state) {
        return state.playerData.playProcess
    },
    getLyric(state) {
        return state.playerData.lyric
    },
    // 3.用户喜欢的音乐
    getLikedSongs(state) {
        return state.userLikedMusicData.likedSongs
    },
    getLikedSongsWithDetail(state) {
        return state.userLikedMusicData.likedSongsWithDetail
    },
    getLikedPlaylists(state) {
        return state.userLikedMusicData.likedPlayLists
    },
    getLikedAlbums(state) {
        return state.userLikedMusicData.likedAlbums
    },
    getLikedArtists(state) {
        return state.userLikedMusicData.likedArtists
    },
    getLikedMVs(state) {
        return state.userLikedMusicData.likedMVs
    },
    getLikedCloudDisk(state) {
        return state.userLikedMusicData.likedCloudDisk
    },

}
export default getters