import request from '@/utils/request'

// 1.获取排行榜中的歌手
export function getArtistToplist(langType){
    const params={}
    if(langType){
        params.type=langType
    }
    return request({
        method:'get',
        url:'/toplist/artist',
        params
    })
}