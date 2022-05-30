import request from '@/utils/request'

// 获取歌手单曲
// 说明 : 调用此接口 , 传入歌手 id, 可获得歌手部分信息和热门歌曲
// 必选参数 : id: 歌手 id, 可由搜索接口获得
// 接口地址 : /artists
// 调用例子 : /artists?id=6452
export function getArtistSingle(params) {
    if (params.limit == null) {
        params.limit = 100
    }
    return request({
        method: 'get',
        url: '/artists',
        params: {
            ...params,
        }
    })
}

// 获取歌手 mv
// 说明 : 调用此接口 , 传入歌手 id, 可获得歌手 mv 信息 , 具体 mv 播放地址
// 可调用/mv传入此接口获得的 mvid 来拿到 , 如 : /artist/mv?id=6452,/mv?mvid=5461064
// 必选参数 : id: 歌手 id, 可由搜索接口获得
// 接口地址 : /artist/mv
// 调用例子 : /artist/mv?id=6452
export function getArtistMV(params) {
    if (params.limit == null) {
        params.limit = 100
    }
    return request({
        method: 'get',
        url: '/artist/mv',
        params: {
            ...params
        }
    })
}

// 获取歌手专辑
// 说明 : 调用此接口 , 传入歌手 id, 可获得歌手专辑内容
// 必选参数 : id: 歌手 id
// 可选参数 : limit: 取出数量 , 默认为 50
// offset: 偏移数量,用于分页, 如:( 页数 -1)*50, 其中50为limit的值 , 默认为0
// 接口地址 : /artist/album
// 调用例子 : /artist/album?id=6452&limit=30 ( 周杰伦 )
export function getArtistAlbum(params) {
    if (params.limit == null) {
        params.limit = 100
    }
    return request({
        method: 'get',
        url: '/artist/album',
        params: {
            ...params
        }
    })
}

// 获取相似歌手
// 说明 : 调用此接口,传入歌手id,可获得相似歌手
// 必选参数 : id: 歌手id
// 接口地址 : /simi/artist
// 调用例子 : /simi/artist?id=6452(对应和周杰伦相似歌手)
export function getSimilarArtist(params) {
    if (params.limit == null) {
        params.limit = 100
    }
    return request({
        method: 'get',
        url: '/simi/artist',
        params: {
            ...params
        }
    })
}

// 获取歌手榜
// 说明 : 调用此接口 , 可获取排行榜中的歌手榜
// 可选参数 :
// type : 地区
// 1: 华语
// 2: 欧美
// 3: 韩国
// 4: 日本
// 接口地址 : /toplist/artist
// 调用例子 : /toplist/artist
export function getArtistToplist(langType) {
    const params = {}
    if (langType) {
        params.type = langType
    }
    return request({
        method: 'get',
        url: '/toplist/artist',
        params
    })
}

// 收藏/取消收藏歌手
// 说明 : 调用此接口,可收藏歌手
// 必选参数 :
// id : 歌手 id
// t:操作,1 为收藏,其他为取消收藏
// 接口地址 : /artist/sub
// 调用例子 : /artist/sub?id=6452&t=1
export function likeAArtist(params) {
    return request({
        method: 'post',
        url: '/artist/sub',
        params: {
            ...params
        }
    })
}