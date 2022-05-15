// 初始化本地存储
import initLocalStorage,{USERDATA_KEY,PLAYERDATA_KEY} from '@/utils/localStorage'
// localStorage
initLocalStorage()

const state = {
    // 一、控制类
    // 1.登录控件显示隐藏
    showLoginBox:false,

    // 二、信存储
    // 1.用户信息
    userData: JSON.parse(localStorage.getItem(USERDATA_KEY)),
    // 2.播放器信息
    playerData:JSON.parse(localStorage.getItem(PLAYERDATA_KEY)),
}

export default state