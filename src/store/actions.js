import { getSongUrl, getSongDetail } from '@/api/song'
import { getPlaylistDetail } from '@/api/songlist'
import { getAlbumDetail } from '@/api/album'
import { getArtistSingle } from '@/api/artist'
import { getUserAccountInfo } from '@/api/auth'
import {
    getLikeList,
    getUserPlayList,
    getUserAlbums,
    getUserArtists,
    getUserMVs,
    getUserCloud
} from '@/api/user'
import { logoutAndClearCookies } from '@/utils/cookie'
import {
    updateProfile,
    updatePlayingState,
    updatePlayList,
    updateShuffledList,
    updateCurrentIndex,
    updatePlayMode,
    updatePlayProcess
} from '@/utils/localStorage'
import { shuffle, isTrackPlayable } from '@/utils/utils'
import { messagebox } from '@/utils/customComponent'
import { message } from 'ant-design-vue'

const actions = {
    // 一、用户信息
    // 1.获取用户的Profile,更新localStorage,提交Vuex
    async setUserProfile({ commit }) {
        // 判断是否登录并返回
        // 获取用户Profile
        try {
            const userProfile = await getUserAccountInfo()
            if (userProfile.code === 200) {
                if (!userProfile.profile) {
                    logoutAndClearCookies()
                    return message.error('登陆失败!您的邮箱可能未绑定手机号!')
                }
                // 更新localStorage
                updateProfile(userProfile.profile)
                // 提交Vuex
                commit('SET_USERPROFILE', { key: 'profile', value: userProfile.profile })
            }
        } catch (error) {
            console.log(error);
        }

    },
    // 2.清除用户的Profile,更新localStorage,提交Vuex
    clearUserProfile({ commit }) {
        updateProfile({})
        commit('SET_USERPROFILE', { key: 'profile', value: {} })
    },

    // 二、Player信息
    // 1.设置currentIndex
    setPlayerCurrentIndex({ commit }, newCurrentIndex) {
        commit('SET_PLAYERCURRENTINDEX', newCurrentIndex)
        updateCurrentIndex(newCurrentIndex)
    },
    // 2.设置播放列表(newPlayList是新歌单的歌曲id数组)
    setPlayerPlayList({ commit, dispatch }, newPlayList) {
        dispatch('setPlayerCurrentIndex', 0)
        if (newPlayList <= 0) return
        // 1.拼接id,同时获取列表中所有歌曲的数据
        const ids = newPlayList.join(',')
        // 2.1获取歌曲详情
        const details = getSongDetail({ ids })
        // 2.1获取歌曲url
        const urls = getSongUrl({ id: ids })
        // 3.使用Promise.all同时发送以上请求,
        // 优点：可以在两个请求都成功后处理，有一个请求失败就处理。
        Promise.all([details, urls])
            .then(res => {
                const detailsRes = res[0]
                const urlsRes = res[1]
                if (detailsRes.code === 200 && urlsRes.code === 200) {
                    // 将成功响应的数据,重新组合成数组
                    const songs = detailsRes.songs
                    const privileges = detailsRes.privileges
                    const urls = urlsRes.data
                    if (songs.length <= 0 || privileges.length <= 0 || urls.length <= 0 || songs.length !== urls.length) {
                        message.warning('歌曲列表获取失败!')
                        return
                    }
                    const newPlayList = []
                    songs.forEach((song, index) => {
                        // urls和songs、privileges循序不一致
                        const urlItem = urls.find(item => item.id === song.id)
                        const playable = isTrackPlayable({
                            songInfo: song,
                            privilege: privileges[index]
                        })
                        if (urlItem.url == null) {
                            playable.playable = false,
                                playable.reason = '无资源'
                        }
                        newPlayList.push({
                            id: song.id,
                            detail: {
                                songInfo: song,
                                privilege: privileges[index]
                            },
                            url: urlItem.url,
                            checked: false,
                            playable
                        })
                    })
                    // console.log(detailsRes, urlsRes, newPlayList);
                    // 将获取的结果提交vuex并在本地存储                    
                    commit('SET_PLAYERPLAYLIST', newPlayList)
                    updatePlayList(newPlayList)
                    const shuffledList = shuffle([...newPlayList])
                    commit('SET_PLAYERSHUFFLEDLIST', shuffledList)
                    updateShuffledList(shuffledList)
                } else {
                    message.warning('歌曲列表获取失败!')
                }
            }, err => {
                console.log(err);
            })
    },
    // 3.设置播放列表(newPlayList是新歌单的所有歌曲的详细播放信息)
    setPlayerPlaylistOnly({ commit, dispatch }, newPlayList) {
        commit('SET_PLAYERPLAYLIST', newPlayList)
        updatePlayList(newPlayList)
        const shuffledList = shuffle([...newPlayList])
        commit('SET_PLAYERSHUFFLEDLIST', shuffledList)
        updateShuffledList(shuffledList)
        dispatch('setPlayerCurrentIndex', 0)
    },
    // 4.单曲操作
    updatePlayerPlayList({ state, commit }, { op, id }) {
        // !important
        // playlist和shuffledlist中的引用是相同只是顺序不同,只需要改一个就可以
        commit('UPDATE_PLAYERPLAYLIST', { op, id })
        updatePlayList(state.playerData['playList'])
        updateShuffledList(state.playerData['shuffledList'])
    },
    // 5.更新播放列表的音乐播放地址
    updatePlayerPlaylistUrls({ state, commit }, newUrls) {
        commit('UPDATE_PLAYERPLAYLISTURL', newUrls)
        updatePlayList(state.playerData['playList'])
        updateShuffledList(state.playerData['shuffledList'])
    },
    // 6..批量删除
    batchDeleteSong({ state, commit }, ids) {
        ids.forEach(id => {
            commit('UPDATE_PLAYERPLAYLIST', { op: 1, id })
            commit('UPDATE_PLAYERSHUFFLEDLIST', { op: 1, id })
        })
        updatePlayList(state.playerData['playList'])
        updateShuffledList(state.playerData['shuffledList'])
    },
    // 7.批量选中
    batchChecked({ state, commit }, checked) {
        const allIDs = []
        state.playerData['playList'].forEach(s => allIDs.push(s.id))
        allIDs.forEach(id => {
            commit('UPDATE_PLAYERPLAYLIST', { op: 0, id, checked })
        })
        updatePlayList(state.playerData['playList'])
        updateShuffledList(state.playerData['shuffledList'])
    },
    // 8.清空播放列表
    clearPlayerPlayList({ commit }) {
        commit('SET_PLAYERPLAYLIST', [])
        commit('SET_PLAYERSHUFFLEDLIST', [])
        updatePlayList([])
        updateShuffledList([])
    },
    // 9.设置播放状态
    setPlayerPlaying({ commit }, newPlayingState) {
        commit('SET_PLAYERPLAYING', newPlayingState)
        updatePlayingState(newPlayingState)
    },
    // 10.设置播放模式
    setPlayerPlayMode({ commit }, newPlayMode) {
        commit("SET_PLAYERPLAYMODE", newPlayMode)
        updatePlayMode(newPlayMode)
    },
    // 11.设置播放进度
    setPlayerPlayProcess({ commit }, newPlayProcess) {
        commit("SET_PLAYERPLAYPROCESS", newPlayProcess)
        updatePlayProcess(newPlayProcess)
    },

    // 三、用户喜欢的音乐
    // 1.设置所有用户喜欢的音乐
    setUserLikedMusicData({ commit, dispatch }, uid) {
        // 1.获取用户喜欢的歌曲列表 
        dispatch('setLikedSongsWidthDetail', uid)
        // 2.获取用户歌单
        dispatch('setLikedPlayLists', uid)
        // 3.获取用户喜欢的专辑
        dispatch('setLikedAlbums')
        // 4.获取用户喜欢的艺人
        dispatch('setLikedArtists')
        // 5.获取用户喜欢的MV
        dispatch('setLikedMVs')
        // 6.获取用户云盘数据
        dispatch('setLikedCloudDisk')
    },
    // 2.更新likedSongs
    setLikedSongs({ commit }, uid) {
        getLikeList({ uid })
            .then(res => {
                if (res.code === 200) {
                    commit('SET_LIKEDSONGS', res.ids)
                }
            })
    },
    // 3.获取likedSongs和likedSongsWithDetail
    setLikedSongsWidthDetail({ commit }, uid) {
        // 获取用户喜欢的歌曲列表 
        getLikeList({ uid })
            .then(res => {
                if (res.code === 200) {
                    commit('SET_LIKEDSONGS', res.ids)
                    const ids = res.ids.join(',')
                    const details = getSongDetail({ ids })
                    const urls = getSongUrl({ id: ids })
                    return Promise.all([details, urls])
                }
            })
            .then(res => {
                const detailsRes = res[0]
                const urlsRes = res[1]
                if (detailsRes.code === 200 && urlsRes.code === 200) {
                    // 将成功响应的数据,重新组合成数组
                    const songs = detailsRes.songs
                    const privileges = detailsRes.privileges
                    const urls = urlsRes.data
                    if (songs.length <= 0 || privileges.length <= 0 || urls.length <= 0 || songs.length !== urls.length) {
                        message.warning('喜欢的歌曲获取失败!')
                        return
                    }
                    const newlikedSongsWithDetail = []
                    songs.forEach((song, index) => {
                        // urls和songs、privileges循序不一致
                        const urlItem = urls.find(item => item.id === song.id)
                        newlikedSongsWithDetail.push({
                            id: song.id,
                            detail: {
                                songInfo: song,
                                privilege: privileges[index]
                            },
                            url: urlItem.url,
                            checked: false,
                            playable: isTrackPlayable({
                                songInfo: song,
                                privilege: privileges[index]
                            })
                        })
                    })
                    // 将获取的结果提交vuex                 
                    commit('SET_LIKEDSONGSWITHDETAIL', newlikedSongsWithDetail)
                } else {
                    message.warning('喜欢的歌曲获取失败!')
                }
            }, err => {
                console.log(err);
            })
    },
    // 4.获取用户歌单
    setLikedPlayLists({ commit }, uid) {
        // 获取用户歌单
        getUserPlayList({ uid }).then(res => {
            if (res.code === 200) {
                commit('SET_LIKEDPLAYLISTS', res.playlist)
            }
        })
    },
    // 5.获取用户喜欢的专辑
    async setLikedAlbums({ commit }) {
        const res = await getUserAlbums()
        // console.log("setLikedAlbums", res);
        if (res.code === 200) {
            commit('SET_LIKEDALBUMS', res.data)
        }
    },
    // 6.获取用户喜欢的艺人
    async setLikedArtists({ commit }) {
        const res = await getUserArtists()
        // console.log("setLikedArtists", res);
        if (res.code === 200) {
            commit('SET_LIKEDARTISTS', res.data)
        }
    },
    // 7.获取用户喜欢的MV
    async setLikedMVs({ commit }) {
        const res = await getUserMVs()
        // console.log("setLikedMVs", res);
        if (res.code === 200) {
            commit('SET_LIKEDMVS', res.data)
        }
    },
    // 8.获取用户云盘数据
    async setLikedCloudDisk({ commit }) {
        const res = await getUserCloud()
        // console.log("setLikedCloudDisk", res);
        if (res.code === 200) {
            commit('SET_LIKEDCLOUDDISK', res.data)
        }
    },

    // 四、音乐获取 
    // 1.获取任意歌单的所有歌曲并播放
    async getPlaylistSongsAndPlay({ dispatch }, id) {
        const res = await getPlaylistDetail({ id })
        let idsArr = []
        if (res.code === 200) {
            idsArr = res.playlist.trackIds.map(t => t.id)
            if (idsArr.length === 0) {
                messagebox.warn('没有歌曲')
            } else {
                dispatch('setPlayerPlayList', idsArr)
            }
        } else {
            messagebox.warn('歌单播放失败')
        }
    },
    // 2.获取任意专辑的所有歌曲并播放
    async getAlbumSongsAndPlay({ dispatch }, id) {
        const res = await getAlbumDetail({ id })
        let idsArr = []
        if (res.code === 200) {
            idsArr = res.songs.map(s => s.id)
            if (idsArr.length === 0) {
                messagebox.warn('专辑中没有歌曲')
            } else {
                dispatch('setPlayerPlayList', idsArr)
            }
        } else {
            messagebox.warn('专辑播放失败')
        }
    },
    // 3.获取任意歌手的所有单曲并播放
    async getArtistSongsAndPlay({ dispatch }, id) {
        const res = await getArtistSingle({ id })
        let idsArr = []
        if (res.code === 200) {
            idsArr = res.hotSongs.map(s => s.id)
            if (idsArr.length === 0) {
                messagebox.warn('没有找到歌手的音乐')
            } else {
                dispatch('setPlayerPlayList', idsArr)
            }
        } else {
            messagebox.warn('歌手单曲播放失败')
        }
    }
}
export default actions