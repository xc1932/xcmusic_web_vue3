
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
    // 设置currentIndex
    SET_PLAYERCURRENTINDEX(state, newCurrentIndex) {
        state.playerData['currentIndex'] = newCurrentIndex
    },
    // 设置播放列表
    SET_PLAYERPLAYLIST(state, newPlayList) {
        state.playerData['playList'] = newPlayList
    },
    // 设置随机播放列表
    SET_PLAYERSHUFFLEDLIST(state, newShuffledList) {
        state.playerData['shuffledList'] = newShuffledList
    },
    // 设置播放状态
    SET_PLAYERPLAYING(state, newPlayingState) {
        state.playerData['playing'] = newPlayingState
    },    
    // 设置播放模式
    SET_PLAYERPLAYMODE(state,newPlayMode){
        state.playerData['playMode']=newPlayMode
    }
}
export default mutations