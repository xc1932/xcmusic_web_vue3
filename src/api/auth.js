import request from '@/utils/request'

// 一、登录
// 1.手机号码+密码登录
export function loginWithPhone(params) {
    return request({
        method: 'post',
        url: '/login/cellphone',
        params
    })
}

// 2.手机号+验证码登录
export function loginWithCaptcha(params) {
    return request({
        methods: 'post',
        url: '/login/cellphone',
        params
    })
}

// 2.1获取验证码
export function getCaptcha(params) {
    return request({
        method: 'get',
        url: '/captcha/sent',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 2.2验证验证码
export function verifyCaptcha(params) {
    return request({
        methods: 'post',
        url: '/captcha/verify',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 3.邮箱+密码登录
export function loginWithEmail(params) {
    return request({
        methods: 'post',
        url: '/login',
        params
    })
}

// 4.二维码登录
// 4.1获取二维码的key(使用key再去请求真正的二维码信息和base64编码图片)
export function getqrKey() {
    return request({
        methods: 'get',
        url: '/login/qr/key',
        params: {
            timestamp: new Date().getTime(),
        }
    })
}

// 4.2生成二维码
export function getqrInfo(params) {
    return request({
        methods: 'get',
        url: '/login/qr/create',
        params: {
            ...params,
            timestamp: new Date().getTime(),
        }
    })
}

// 4.3获取扫码状态
// (后端缓存机制，相同 url 会在两分钟内只向网易服务器发一次请求，
// 加一个时间戳参数使 url 不同)
export function checkQRStatus(params) {
    return request({
        methods: 'get',
        url: '/login/qr/check',
        params: {
            ...params,
            timestamp: new Date().getTime(),
        }
    })
}

// 5.退出登录
export function logout() {
    request({
        methods: 'get',
        url: '/logout'
    })
}

// 二、注册
// 1.检测手机号是否注册
export function checkPhoneRegister(params) {
    return request({
        methods: 'get',
        url: '/cellphone/existence/check',
        params
    })
}

// 三、用户信息
export function getUserAccountInfo() {
    return request({
        methods: 'get',
        url: '/user/account',
        params: {
            timestamp: new Date().getTime(),
        }
    })
}