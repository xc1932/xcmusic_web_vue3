import Cookies from 'js-cookie'
import { logout } from '@/api/auth'
import store from '@/store/index'
// 1.设置cookie
export function setCookies(cookieString) {
    const cookies = cookieString.split(';;')
    cookies.forEach(cookie => {
        document.cookie = cookie
    })
}

// 2.获取对应的cookie
export function getCookie(key) {
    return Cookies.get(key)
}

// 3.移除对应的cookie
export function removeCookie(key) {
    Cookies.remove(key)
}

// 4.判断是否登录(MUSIC_U 只有在账户登录的情况下才有)
export function isLoggedIn() {
    return Cookies.get('MUSIC_U') !== undefined
}

// 5.退出登录并清空cookies
export function logoutAndClearCookies() {
    logout()
    // 清空cookie
    removeCookie('MUSIC_U')
    removeCookie('MUSIC_SNS')
    removeCookie('__csrf')
    removeCookie('__remember_me')
    // 清空localStorage和vuex
    store.dispatch('clearUserProfile')
}