import { ref, reactive, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import {
    getRecommendSonglist,
    getTopList,
    getDailyRecommendList,
    getHighQualityTags,
    getHighQuality,
    getTopPlaylist,
    getHotPlaylistCategory,
    getPlaylistCatlist
} from '@/api/songlist'

export default function useExploreViewControls() {
    // vue-router
    const route = useRoute()
    const router = useRouter()
    // vuex
    const store = useStore()
    const selectedCategories = computed(() => store.getters.getUserSelectedCategories)

    // data
    const categoryObj = ref(null)
    const selectedCat = ref("");
    const showCategoryPanel = ref(false);
    const playlistData = reactive({})

    // methods
    // 1.选中cat
    const selectCat = (cat) => {
        router.push({ path: '/explore', query: { cat } })
    };
    // 2.显示分类面板
    const showMoreCategory = () => {
        showCategoryPanel.value = !showCategoryPanel.value;
    };
    // 3.加载更多
    const loadMore = async () => {
        playlistData.hasMore = false
        playlistData.total = 0
        playlistData.playlists = []
        let offset = 0
        let before = 0
        if (playlistData.playlists.length > 0) {
            const length = playlistData.playlists.length
            offset = length
            before = playlistData.playlists[length - 1].updateTime
        }
        const selectedCatVal = selectedCat.value
        if (selectedCatVal === '推荐') {
            const res = await getRecommendSonglist({ limit: 1000 })
            if (res.code === 200) {
                playlistData.hasMore = false
                playlistData.total = 1000
                const newData = res.result.map(p => {
                    return {
                        id: p.id,
                        playlistName: p.name,
                        playlistCover: p.picUrl,
                        trackCount: p.trackCount,
                        playCount: p.playCount
                    }
                })
                if (playlistData.playlists) {
                    playlistData.playlists = playlistData.playlists.concat(newData)
                } else {
                    playlistData.playlists = newData
                }
            }
        } else if (selectedCatVal === '精品') {
            const res = await getHighQuality({ limit: 30, before })
            if (res.code === 200) {
                playlistData.hasMore = res.more
                playlistData.total = res.total
                const newData = res.playlists.map(p => {
                    return {
                        id: p.id,
                        playlistName: p.name,
                        playlistCover: p.coverImgUrl,
                        trackCount: p.trackCount,
                        playCount: p.playCount,
                        updateTime: p.updateTime
                    }
                })
                if (playlistData.playlists) {
                    playlistData.playlists = playlistData.playlists.concat(newData)
                } else {
                    playlistData.playlists = newData
                }
            }
        } else if (selectedCatVal === '排行榜') {
            const res = await getTopList()
            if (res.code === 200) {
                playlistData.hasMore = false
                playlistData.total = 100
                const newData = res.list.map(p => {
                    return {
                        id: p.id,
                        playlistName: p.name,
                        playlistCover: p.coverImgUrl,
                        trackCount: p.trackCount,
                        playCount: p.playCount
                    }
                })
                if (playlistData.playlists) {
                    playlistData.playlists = playlistData.playlists.concat(newData)
                } else {
                    playlistData.playlists = newData
                }
            }
        } else {
            const res = await getTopPlaylist({ cat: selectedCat.value, offset })
            if (res.code === 200) {
                playlistData.hasMore = res.more
                playlistData.total = res.total
                const newData = res.playlists.map(p => {
                    return {
                        id: p.id,
                        playlistName: p.name,
                        playlistCover: p.coverImgUrl,
                        trackCount: p.trackCount,
                        playCount: p.playCount
                    }
                })
                if (playlistData.playlists) {
                    playlistData.playlists = playlistData.playlists.concat(newData)
                } else {
                    playlistData.playlists = newData
                }
            }
        }
    }

    // watchs
    // 获取对应分类的播放列表
    watch(selectedCat, (newCat) => {
        loadMore()
    }, { immediate: true })
    // 监听路由查询参数变换设置选中的cat
    watch(route, (newRoute) => {
        selectedCat.value = newRoute.query.cat;
    }, { immediate: true })

    // init Data
    // 获取歌单分类    
    getPlaylistCatlist().then(res => {
        if (res.code === 200) {
            const categories = res.categories
            const subs = res.sub.map(s => {
                return {
                    category: s.category,
                    name: s.name
                }
            })
            categoryObj.value = {
                categories,
                subs
            }
        }
    })

    return {
        // vuex
        selectedCategories,
        // data
        categoryObj,
        selectedCat,
        showCategoryPanel,
        playlistData,
        // methods
        selectCat,
        showMoreCategory,
        loadMore
    }
}