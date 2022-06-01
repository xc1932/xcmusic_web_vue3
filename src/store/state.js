// 初始化本地存储
import initLocalStorage, { USERDATA_KEY, PLAYERDATA_KEY, USERSETTING_KEY } from '@/utils/localStorage'
// localStorage
initLocalStorage()

const state = {
    // 一、控制类
    // 1.登录控件显示隐藏
    showLoginBox: false,

    // 二、信息存储
    // 1.用户信息
    userData: JSON.parse(localStorage.getItem(USERDATA_KEY)),
    // 2.播放器信息
    playerData: JSON.parse(localStorage.getItem(PLAYERDATA_KEY)),
    // 3.用户设置
    userSetting: JSON.parse(localStorage.getItem(USERSETTING_KEY)),

    // 三、信息共享类 
    // 1.用户喜欢的音乐  
    userLikedMusicData: {
        likedSongs: [],
        likedSongsWithDetail: [],
        likedPlayLists: [],
        likedAlbums: [],
        likedArtists: [],
        likedMVs: [],
        likedCloudDisk: []
    },
}

export default state