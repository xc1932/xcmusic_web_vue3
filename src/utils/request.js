import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import allowedURL from '@/utils/constant'

NProgress.configure({
    showSpinner: false,
    trickleSpeed: 100,
    // parent:'.login-container'
});

const baseURL = 'https://xc1932-cloud-music-api.vercel.app/'

// 创建实例时配置默认值
const service = axios.create({
    baseURL,
    // 跨域请求时是否需要使用凭证
    withCredentials: true,
    // 请求超时的毫秒数
    timeout: 15000,
})

// 在请求或响应被 then 或 catch 处理前拦截它们
// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 显示进度条
    if (allowedURL.includes(config.url)) {
        NProgress.start()
    }
    return config
})

// 添加响应拦截器
service.interceptors.response.use(response => {
    // 完成进度条
    if (allowedURL.includes(response.config.url)) {
        NProgress.done()
    }
    return response.data
}, error => {
    console.log('error', error);
    throw error
})

export default service
