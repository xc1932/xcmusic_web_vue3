import {playMode} from '@/utils/constant'

// 1.初始化本地存储
export default function initLocalStorage() {
    // 初始化UserData
    initUserData()
    // 初始化PlayerData
    initPlayerData()
}

export const USERDATA_KEY = 'UserData_xcmusic'
export const PLAYERDATA_KEY = 'PlayerData_xcmusic'

// 一、用户数据
// 1.初始化UserData
export function initUserData() {
    const userData = localStorage.getItem(USERDATA_KEY)
    if (userData) return
    localStorage.setItem(USERDATA_KEY, JSON.stringify({
        profile: {}
    }))
}

// 2.更新profile
export function updateProfile(profile) {
    let userData = localStorage.getItem(USERDATA_KEY) ?? '{}'
    userData = JSON.parse(userData)
    userData['profile'] = profile
    localStorage.setItem(USERDATA_KEY, JSON.stringify(userData))
}

// 二、Player数据
// 1.初始化PlayerData
export function initPlayerData() {
    const playerData = localStorage.getItem(PLAYERDATA_KEY)
    if (playerData) return
    localStorage.setItem(PLAYERDATA_KEY, JSON.stringify({
        currentIndex: 0,            // 当前播放歌曲索引
        playList: [],               // 播放列表
        shuffledList: [],           // 随机播放列表
        playing: false,             // 播放状态     
        playMode:playMode.listLoop, // 播放模式
        playProcess:0,              //播放进度
    }))
}

// 2.更新正在播放歌曲索引
export function updateCurrentIndex(newCurrentIndex) {
    updatePlayerData('currentIndex', newCurrentIndex)
}

// 3.更新播放列表
export function updatePlayList(newPlayList) {
    updatePlayerData('playList', newPlayList)
}

export function updateShuffledList(newShuffledList) {
    updatePlayerData('shuffledList', newShuffledList)
}

// 4.更新播放状态
export function updatePlayingState(newPlayingState) {
    updatePlayerData('playing', newPlayingState)
}

// 5.更新播放模式
export function updatePlayMode(newPlayMode){
    updatePlayerData('playMode',newPlayMode)
}

// 6.更新播放进度
export function updatePlayProcess(newPlayProcess){
    updatePlayerData('playProcess',newPlayProcess)
}

// 更新PlayerData
function updatePlayerData(key, value) {
    let playerData = localStorage.getItem(PLAYERDATA_KEY)
    if (!playerData) return
    playerData = JSON.parse(playerData)
    playerData[key] = value
    localStorage.setItem(PLAYERDATA_KEY, JSON.stringify(playerData))
}
