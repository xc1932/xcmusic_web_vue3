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