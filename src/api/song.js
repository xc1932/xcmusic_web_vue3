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

// @@获取歌曲详情 
// 说明 : 调用此接口 , 传入音乐 id(支持多个 id, 用 , 隔开), 可获得歌曲详情(dt为歌曲时长)
// 必选参数 : ids: 音乐 id, 如 ids=347230
// 接口地址 : /song/detail
// 调用例子 : /song/detail?ids=347230,/song/detail?ids=347230,347231
export function getSongDetail(params) {
    return request({
        method: 'get',
        url: '/song/detail',
        params
    })
}

// @@获取歌曲url(支持多个id用 ，隔开)
// 说明 : 使用歌单详情接口后 , 能得到的音乐的 id, 但不能得到的音乐 url, 调用此接口, 
// 传入的音乐 id( 可多个 , 用逗号隔开 ), 可以获取对应的音乐的 url,未登录状态或者非会
// 员返回试听片段(返回字段包含被截取的正常歌曲的开始时间和结束时间)
// 必选参数 : id : 音乐 id
// 可选参数 : br: 码率,默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,其他类推
// 接口地址 : /song/url
// 调用例子 : /song/url?id=33894312 /song/url?id=405998841,33894312
export function getSongUrl(params) {
    if (!params.br) {
        params.br = 320000 //默认最低码率
    }
    return request({
        method: 'get',
        url: '/song/url',
        params
    })
}

// @@获取歌词
// 说明 : 调用此接口 , 传入音乐 id 可获得对应音乐的歌词 ( 不需要登录 )
// 必选参数 : id: 音乐 id
// 接口地址 : /lyric
// 调用例子 : /lyric?id=33894312
export function getLyric(params) {
    return request({
        method: 'get',
        url: '/lyric',
        params
    })
}


