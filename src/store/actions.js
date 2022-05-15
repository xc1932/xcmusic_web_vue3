import { getSongAvailable, getSongUrl, getLyric, getSongDetail } from '@/api/song'
import { getUserAccountInfo } from '@/api/auth'
import { logoutAndClearCookies } from '@/utils/cookie'
import {
    updateProfile,
    updatePlayingState,
    updatePlayList,
    updateShuffledList,
    updateCurrentIndex,
    updatePlayMode,
} from '@/utils/localStorage'
import { shuffle } from '@/utils/utils'
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

    // 2.设置播放列表
    setPlayerPlayList({ commit }, newPlayList) {
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
                        newPlayList.push({
                            id: song.id,
                            detail: {
                                songInfo: song,
                                privilege: privileges[index]
                            },
                            url: urls[index].url
                        })
                    })
                    
                    // console.log(detailsRes, urlsRes,newPlayList);  
                    // 将获取的结果提交vuex并在本地存储                    
                    commit('SET_PLAYERPLAYLIST', newPlayList)
                    updatePlayList(newPlayList)
                    const shuffledList = shuffle(newPlayList)
                    commit('SET_PLAYERSHUFFLEDLIST', shuffledList)
                    updateShuffledList(shuffledList)
                } else {
                    message.warning('歌曲列表获取失败!')
                }
            }, err => {
                console.log(err);
            })
    },

    // 3.设置播放状态
    setPlayerPlaying({ commit }, newPlayingState) {
        commit('SET_PLAYERPLAYING', newPlayingState)
        updatePlayingState(newPlayingState)
    },
    // 4.设置播放模式
    setPlayerPlayMode({ commit }, newPlayMode) {
        commit("SET_PLAYERPLAYMODE", newPlayMode)
        updatePlayMode(newPlayMode)
    }

}
export default actions