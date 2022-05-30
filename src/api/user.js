import request from '@/utils/request'

// 1.喜欢或取消喜欢音乐
// 必选参数 : id: 歌曲 id
// 可选参数 : like: 布尔值 , 默认为 true 即喜欢 , 若传 false, 则取消喜欢
// 接口地址 : /like
// 调用例子 : /like?id=347230
export function likeSong(params) {
    return request({
        method: 'post',
        url: '/like',
        params: {
            ...params,
            timestamp: new Date().getTime()
        },
    })
}

// 2.获取用户喜欢的音乐列表  
// 必选参数:uid(用户id)
// 接口地址:/likelist
// 调用示例:/likelist?uid=32953014
export function getLikeList(params) {
    return request({
        method: 'get',
        url: 'likelist',
        params: {
            ...params,
            timestamp: new Date().getTime()
        },
    })
}

// 3.获取用户歌单列表
// 必选参数 : uid : 用户 id
// 可选参数 :
// limit : 返回数量 , 默认为 30
// offset : 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
// 接口地址 : /user/playlist
// 调用例子 : /user/playlist?uid=32953014
export function getUserPlayList(params) {
    return request({
        method: 'get',
        url: '/user/playlist',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 4.对用户歌单添加或删除歌曲
// 必选参数 :
// op: 从歌单增加单曲为 add, 删除为 del
// pid: 歌单id tracks: 歌曲 id,可多个,用逗号隔开
// 接口地址 : /playlist/tracks
// 调用例子 : /playlist/tracks?op=add&pid=24381616&tracks=347231
export function addOrDeleteSongFromPlaylist(params) {
    return request({
        method: 'post',
        url: '/playlist/tracks',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 5.新建用户歌单
// 必选参数 : name : 歌单名
// 可选参数 :
// privacy : 是否设置为隐私歌单，默认否，传'10'则设置成隐私歌单
// type : 歌单类型,默认'NORMAL',传 'VIDEO'则为视频歌单,传 'SHARED'则为共享歌单
// 接口地址 : /playlist/create
// 调用例子 : /playlist/create?name=测试歌单,/playlist/create?name=test&type=VIDEO
export function createPlaylist(params) {
    return request({
        method: 'post',
        url: '/playlist/create',
        params: {
            ...params,
        }
    })
}

// 删除用户歌单
// 说明 : 调用此接口 , 传入歌单 id 可删除歌单
// 必选参数 : id : 歌单 id,可多个,用逗号隔开
// 接口地址 : /playlist/delete
// 调用例子 : /playlist/delete?id=2947311456 , /playlist/delete?id=5013464397,5013427772
export function deletePlaylist(params) {
    return request({
        method: 'post',
        url: '/playlist/delete',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 6.获取用户收藏专辑列表
// 说明 : 调用此接口 , 可获得已收藏专辑列表
// 可选参数 :
// limit: 取出数量 , 默认为 25
// offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*25, 其中 25 为 limit 的值 , 默认 为 0
// 接口地址 : /album/sublist
// 调用例子 : /album/sublist ( 周杰伦 )
export function getUserAlbums(params) {
    return request({
        method: 'get',
        url: '/album/sublist',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 7.获取用户收藏的歌手列表
// 说明 : 调用此接口,可获取收藏的歌手列表
// 接口地址 : /artist/sublist
// 调用例子 : /artist/sublist
export function getUserArtists(params) {
    return request({
        method: 'get',
        url: '/artist/sublist',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 8.获取用户收藏的MV列表
// 说明 : 调用此接口,可获取收藏的 MV 列表
// 接口地址 : /mv/sublist
// 调用例子 : /mv/sublist
export function getUserMVs(params) {
    return request({
        method: 'get',
        url: '/mv/sublist',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 9.获取用户订阅的电台列表
// 说明 : 登录后调用此接口 , 可获取订阅的电台列表
// 接口地址 : /dj/sublist
// 调用例子 : /dj/sublist
export function getUserDJs(params) {
    return request({
        method: 'get',
        url: '/dj/sublist',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 10.获取用户收藏的专栏
// 说明 : 调用此接口,可获取收藏的专栏
// 可选参数 :
// limit: 取出歌单数量 , 默认为 50
// offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
// 接口地址 : /topic/sublist
// 调用例子 : /topic/sublist?limit=2&offset=1
export function getUserTopics(params) {
    return request({
        method: 'get',
        url: '/topic/sublist',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 11.获取用户云盘数据
// 说明 : 登录后调用此接口 , 可获取云盘数据 , 获取的数据没有对应 url, 
// 需要再调用一 次 /song/url 获取 url
// 可选参数 :
// limit : 返回数量 , 默认为 200
// offset : 偏移数量，用于分页 , 如 :( 页数 -1)*200, 其中 200 为 limit 的值 , 默认为 0
// 接口地址 : /user/cloud
// 调用例子 : /user/cloud
export function getUserCloud(params) {
    return request({
        method: 'get',
        url: '/user/cloud',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 12.获取用户云盘数据详情
// 说明 : 登录后调用此接口 , 传入云盘歌曲 id，可获取云盘数据详情
// 必选参数 : id: 歌曲 id,可多个,用逗号隔开
// 接口地址 : /user/cloud/detail
// 调用例子 : /user/cloud/detail?id=5374627
export function getUserCloudDetail(params) {
    return request({
        method: 'get',
        url: '/user/cloud/detail',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 13.获取用户信息
// 说明 : 登录后调用此接口 , 传入用户 id, 可以获取用户详情
// 必选参数 : uid : 用户 id
// 接口地址 : /user/detail
// 调用例子 : /user/detail?uid=32953014
export function getUserInfo(params) {
    return request({
        method: 'get',
        url: '/user/detail',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 14.获取用户账号信息
// 获取账号信息
// 说明 : 登录后调用此接口 ,可获取用户账号信息
// 接口地址 : /user/account
// 调用例子 : /user/account
export function getUserAccountInfo(params) {
    return request({
        method: 'get',
        url: '/user/account',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 15.获取私人FM
// 说明 : 私人 FM( 需要登录 )
// 接口地址 : /personal_fm
// 调用例子 : /personal_fm
export function getUserPrivateFM() {
    return request({
        method: 'get',
        url: '/personal_fm',
        params: {
            timestamp: new Date().getTime()
        }
    })
}

// 16.从FM中移除音乐
// 说明 : 调用此接口 , 传入音乐 id, 可把该音乐从私人 FM 中移除至垃圾桶
// 必选参数 : id: 歌曲 id
// 接口地址 : /fm_trash
// 调用例子 : /fm_trash?id=347230
export function deleteSongFromUserPrivateFM(params) {
    return request({
        method: 'post',
        url: '/fm_trash',
        params
    })
}