import request from '@/utils/request'

// 获取歌单api
// 1.获取推荐歌单
export function getRecommendSonglist(params){
    return request({
        methods:'get',
        url:'/personalized',
        params
    })
}

// 2.获取所有榜单
export function getTopList(){
    return request({
        methods:'get',
        url:'/toplist'
    })
}

// 3.获取每日推荐歌单
export function getDailyRecommendList(){
    return request({
        methods:'get',
        url:'/recommend/resource'
    })
}

// 4.获取每日推荐歌曲
export function getDailyRecommendSongs(){
    return request({
        method:'get',
        url:'/recommend/songs'
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
export function getPlaylistDetail(params){
    return request({
        method:'get',
        url:'/playlist/detail',
        params:{
            ...params,
            timestamp:new Date().getTime()
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
export function getPlaylistAllSongs(params){
    return request({
        method:'get',
        url:'/playlist/track/all',
        params:{
            ...params,
            timestamp:new Date().getTime()
        }
    })
}

// 7.收藏/取消收藏歌单
// 说明 :调用此接口,传入类型和单id可收藏歌单或者取消收藏歌单
// 必选参数 :
// t : 类型,1:收藏,2:取消收藏  id:歌单id
// 接口地址 : /playlist/subscribe
// 调用例子 : /playlist/subscribe?t=1&id=106697785 /play歌list/subscribe?t=2&id=106697785
export function subscribePlaylist(params){
    return request({
        method:'post',
        url:'/playlist/subscribe',
        params
    })
}