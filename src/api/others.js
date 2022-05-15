import request from '@/utils/request'

// 1.获取轮播图数据
export function getBanner(params) {
    return request({
        methods: 'get',
        url: '/banner',
        params
    })
}