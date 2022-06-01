// 开启nprocess的请求
export default [
    "/logout",
    '/login/cellphone',
    '/login',
    '/login/qr/create',
    '/playlist/detail',
    '/song/detail',
    '/search',
    '/album/new',
    '/top/playlist',
    '/personalized',
    '/toplist',
    '/top/playlist/highquality'
]

// 默认图片
export const defaultImgUrl = "https://p2.music.126.net/0-Ybpa8FrDfRgKYCTJD8Xg==/109951164796696795.jpg";

// 播放模式枚举常量
export const playMode = {
    listLoop: 0,
    singleLoop: 1,
    randomLoop: 2
}
