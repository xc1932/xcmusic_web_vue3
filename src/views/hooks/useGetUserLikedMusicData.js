import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import {isLoggedIn} from '@/utils/cookie'


export default function useGetUserLikedMusicData() {
    // vuex
    const store = useStore()
    const userId = computed(() => store.getters.getUserID)

    // watch
    watch(userId, (newId) => {
        if (newId == null) return
        store.dispatch('setUserLikedMusicData',newId)
    }, { immediate: true })

    // 登录先更新用户信息
    if(isLoggedIn()){
        store.dispatch('setUserProfile')
    }
}