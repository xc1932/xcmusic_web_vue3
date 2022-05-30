import request from '@/utils/request'

// 获取专辑内容
// 说明 : 调用此接口 , 传入专辑 id, 可获得专辑内容
// 必选参数 : id: 专辑 id
// 接口地址 : /album
// 调用例子 : /album?id=32311
export function getAlbumDetail(params) {
    return request({
        method: 'get',
        url: '/album',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 获取专辑动态信息
// 说明 : 调用此接口 , 传入专辑 id, 可获得专辑动态信息,如是否收藏,收藏数,评论数,分享数
// 必选参数 : id: 专辑 id
// 接口地址 : /album/detail/dynamic
// 调用例子 : /album/detail/dynamic?id=32311
export function getAlbumDynamicDetail(params) {
    return request({
        method: 'get',
        url: '/album/detail/dynamic',
        params: {
            ...params,
            timestamp: new Date().timestamp
        }
    })
}

// 获取全部新碟
// 说明 : 登录后调用此接口 ,可获取全部新碟
// 可选参数 :
// limit : 返回数量 , 默认为 30
// offset : 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
// area : ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本
// 接口地址 : /album/new
// 调用例子 : /album/new?area=KR&limit=10
export function getNewAlbums(params) {
    return request({
        method: 'get',
        url: '/album/new',
        params
    })
}

// 收藏/取消收藏专辑
// 说明 : 调用此接口,可收藏/取消收藏专辑
// 必选参数 :
// id : 专辑 id
// t : 1 为收藏,其他为取消收藏
// 接口地址 : /album/sub
// 调用例子 : /album/sub?t=1 /album/sub?t=0
export function subscribeAlbum(params) {
    return request({
        method: 'post',
        url: '/album/sub',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

