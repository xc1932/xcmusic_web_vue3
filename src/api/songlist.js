import request from '@/utils/request'

// 1.获取推荐歌单
// 说明 : 调用此接口 , 可获取推荐歌单
// 可选参数 : limit: 取出数量 , 默认为 30 (不支持 offset)
// 接口地址 : /personalized
// 调用例子 : /personalized?limit=1
export function getRecommendSonglist(params) {
    return request({
        methods: 'get',
        url: '/personalized',
        params
    })
}

// 2.获取所有榜单
// 说明 : 调用此接口,可获取所有榜单 接口地址 : /toplist
// 调用例子 : /toplist
export function getTopList() {
    return request({
        methods: 'get',
        url: '/toplist'
    })
}

// 3.获取每日推荐歌单
// 说明 : 调用此接口 , 可获得每日推荐歌单 ( 需要登录 )
// 接口地址 : /recommend/resource
// 调用例子 : /recommend/resource
export function getDailyRecommendList() {
    return request({
        methods: 'get',
        url: '/recommend/resource'
    })
}

// 4.获取每日推荐歌曲
// 说明 : 调用此接口 , 可获得每日推荐歌单 ( 需要登录 )
// 接口地址 : /recommend/resource
// 调用例子 : /recommend/resource
export function getDailyRecommendSongs() {
    return request({
        method: 'get',
        url: '/recommend/songs'
    })
}

// 精品歌单标签列表
// 说明 : 调用此接口 , 可获取精品歌单标签列表
// 接口地址 : /playlist/highquality/tags
// 调用例子 : /playlist/highquality/tags
export function getHighQualityTags() {
    return request({
        method: 'get',
        url: '/playlist/highquality/tags',
    })
}

// 获取精品歌单
// 说明 : 调用此接口 , 可获取精品歌单
// 可选参数 : cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 
// 默认为 "全部",可从精品歌单标签列表接口获取(/playlist/highquality/tags)
// limit: 取出歌单数量 , 默认为 20
// before: 分页参数,取上一页最后一个歌单的 updateTime 获取下一页数据
// 接口地址 : /top/playlist/highquality
// 调用例子 : /top/playlist/highquality?before=1503639064232&limit=3
export function getHighQuality(params) {
    return request({
        method: 'get',
        url: '/top/playlist/highquality',
        params
    })
}

// 歌单 ( 网友精选碟 )
// 说明 : 调用此接口 , 可获取网友精选碟歌单
// 可选参数 : order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
// cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
// limit: 取出歌单数量 , 默认为 50
// offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
// 接口地址 : /top/playlist
// 调用例子 : /top/playlist?limit=10&order=new
export function getTopPlaylist(params) {
    return request({
        method: 'get',
        url: '/top/playlist',
        params,
    });
}

// 获取热门歌单分类
// 说明 : 调用此接口,可获取歌单分类,包含 category 信息
// 接口地址 : /playlist/hot
// 调用例子 : /playlist/hot
export function getHotPlaylistCategory() {
    return request({
        method: 'get',
        url: '/playlist/hot'
    })
}

// 获取歌单分类
// 说明 : 调用此接口,可获取歌单分类,包含 category 信息
// 接口地址 : /playlist/catlist
// 调用例子 : /playlist/catlist
export function getPlaylistCatlist() {
    return request({
        method: 'get',
        url: '/playlist/catlist'
    })
}


// 5.获取歌单详情
// 说明 : 歌单能看到歌单名字, 但看不到具体歌单内容 , 调用此接口 , 传入歌单 id,
// 可以获取对应歌单内的所有的音乐(未登录状态只能获取不完整的歌单,登录后是完整的)，
// 但是返回的 trackIds 是完整的，tracks 则是不完整的，可拿全部 trackIds 请求一
// 次 song/detail 接口获取所有歌曲的详情 
// 必选参数 : id : 歌单 id
// 可选参数 : s : 歌单最近的 s 个收藏者,默认为 8
// 接口地址 : /playlist/detail
// 调用例子 : /playlist/detail?id=24381616
export function getPlaylistDetail(params) {
    return request({
        method: 'get',
        url: '/playlist/detail',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 6.获取歌单所有歌曲
// 说明 : 由于网易云接口限制，歌单详情只会提供 10 首歌，通过调用此接口，
// 传入对应的歌单id，即可获得对应的所有歌曲
// 必选参数 : id : 歌单 id
// 可选参数 : limit : 限制获取歌曲的数量，默认值为当前歌单的歌曲数量
// 可选参数 : offset : 默认值为0
// 接口地址 : /playlist/track/all
// 调用例子 : /playlist/track/all?id=24381616&limit=10&offset=1
export function getPlaylistAllSongs(params) {
    return request({
        method: 'get',
        url: '/playlist/track/all',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 7.收藏/取消收藏歌单
// 说明 :调用此接口,传入类型和单id可收藏歌单或者取消收藏歌单
// 必选参数 :
// t : 类型,1:收藏,2:取消收藏  id:歌单id
// 接口地址 : /playlist/subscribe
// 调用例子 : /playlist/subscribe?t=1&id=106697785 /playlist/subscribe?t=2&id=106697785
export function subscribePlaylist(params) {
    return request({
        method: 'post',
        url: '/playlist/subscribe',
        params
    })
}