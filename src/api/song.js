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

// 获取歌曲详情
// 说明 : 调用此接口 , 传入音乐 id(支持多个 id, 用 , 隔开), 可获得歌曲详情(dt为歌曲时长)
// 必选参数 : ids: 音乐 id, 如 ids=347230
// 接口地址 : /song/detail
// 调用例子 : /song/detail?ids=347230,/song/detail?ids=347230,347231
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


