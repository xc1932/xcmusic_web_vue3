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
    // 2.Player信息    
    getCurrentIndex(state){
        return state.playerData.currentIndex
    },
    getPlayList(state){
        return state.playerData.playList
    },
    getShuffledList(state){
        return state.playerData.shuffledList
    },
    getCurSong(state){
        return state.playerData?.playList[state.playerData.currentIndex]||{}
    },
    getPlaying(state){
        return state.playerData.playing
    },
    getPlayMode(state){
        return state.playerData.playMode
    }
}
export default getters