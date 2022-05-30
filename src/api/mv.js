import request from '@/utils/request'

// 获取 mv 数据
// 说明: 调用此接口, 传入mvid(在搜索音乐的时候传type = 1004获得),可获取对应MV数据,
// 数据包含mv名字,歌手,发布时间,mv视频地址等数据,其中mv视频网易做了防盗链处理,可能不
// 能直接播放,需要播放的话需要调用'mv地址'接口
// 必选参数: mvid: mv 的 id
// 接口地址: /mv/detail
// 调用例子: /mv/detail ? mvid = 5436712
export function getMVDetail(params) {
    return request({
        method: 'get',
        url: '/mv/detail',
        params: {
            ...params
        }
    })
}

// 获取mv 地址
// 说明 : 调用此接口 , 传入 mv id,可获取 mv 播放地址
// 必选参数 : id: mv id
// 可选参数 : r: 分辨率,默认 1080,可从 /mv/detail 接口获取分辨率列表
// 接口地址 : /mv/url
// 调用例子 :
// /mv/url?id=5436712 /mv/url?id=10896407&r=1080
export function getMVUrl(params) {
    return request({
        method: 'get',
        url: '/mv/url',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 获取相似 mv
// 说明 : 调用此接口 , 传入 mvid 可获取相似 mv
// 必选参数 : mvid: mv id
// 接口地址 : /simi/mv
// 调用例子 : /simi/mv?mvid=5436712
export function getSimilarMV(params) {
    return request({
        method: 'get',
        url: '/simi/mv',
        params: {
            ...params
        }
    })
}

// 收藏/取消收藏 MV
// 说明 : 调用此接口,可收藏/取消收藏 MV
// 必选参数 :
// mvid : MV id
// t : 1 为收藏,其他为取消收藏
// 接口地址 : /mv/sub
// 调用例子 : /mv/sub
export function likeAMV(params) {
    return request({
        method: 'post',
        url: '/mv/sub',
        params: {
            ...params
        }
    })
}