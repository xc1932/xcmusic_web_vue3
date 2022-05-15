import request from '@/utils/request'

// 1.获取新专辑
export function getNewAlbums(params) {
    return request({
        methods: 'get',
        url: '/album/new',
        params
    })
}