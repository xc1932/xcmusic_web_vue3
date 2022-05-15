import request from '@/utils/request'

// 获取歌曲是否可用
export function getSongAvailable(params) {
    if (!params.br) {
        params.br = 320000 //默认最低码率
    }
    return request({
        methods: 'get',
        url: '/check/music',
        params
    })
}

// 获取歌曲详情(支持多个id用 ，隔开)
export function getSongDetail(params) {
    return request({
        methods: 'get',
        url: '/song/detail',
        params
    })
}

// 获取歌曲url(支持多个id用 ，隔开)
export function getSongUrl(params) {
    if (!params.br) {
        params.br = 320000 //默认最低码率
    }
    return request({
        methods: 'get',
        url: '/song/url',
        params
    })
}

// 获取歌词
export function getLyric(params) {
    return request({
        methods: 'get',
        url: '/lyric',
        params
    })
}


