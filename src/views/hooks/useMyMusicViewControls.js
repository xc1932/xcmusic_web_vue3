import { computed } from 'vue'
import { useStore } from 'vuex'
import { messagebox } from '@/utils/customComponent'
import { likeAAlbum } from '@/api/album'
import { likeAMV } from '@/api/mv'

export default function useMyMusicViewControls() {
    // vuex
    const store = useStore()
    const likedAlbums = computed(() => store.getters.getLikedAlbums);
    const likedArtists = computed(() => store.getters.getLikedArtists);
    const likedMVs = computed(() => store.getters.getLikedMVs);
    const likedCloudDisk = computed(() => store.getters.getLikedCloudDisk);

    // album
    // 1.播放专辑中的全部歌曲
    const playAllSongInAlbum = (album) => {
        if (album.size <= 0) {
            messagebox.warn('专辑中没有歌曲')
            return
        }
        store.dispatch('getAlbumSongsAndPlay', album.id)
    }
    // 2.删除专辑
    const deleteMyAlbum = async (id) => {
        const res = await likeAAlbum({ id })
        if (res.code === 200) {
            messagebox.success('删除成功')
            store.dispatch('setLikedAlbums')
        } else {
            messagebox.warn('删除失败')
        }
    }

    // artist
    // 1.播放歌手的全部单曲
    const playAllSongOfArtist = (id) => {
        store.dispatch('getArtistSongsAndPlay', id)
    }

    // MV
    // 1.播放收藏的MV
    const playMV = (id) => {
        console.log(id);
    }
    // 2.删除收藏的MV
    const deleteMyMV = async (mvid) => {
        const res = await likeAMV({ mvid })
        if (res.code === 200) {
            messagebox.success('删除成功')
            store.dispatch('setLikedMVs')
        } else {
            messagebox.warn('删除失败')
        }
    }

    return {
        // vuex
        likedAlbums,
        likedArtists,
        likedMVs,
        likedCloudDisk,
        // methods
        playAllSongInAlbum,
        deleteMyAlbum,
        playAllSongOfArtist,
        playMV,
        deleteMyMV
    }
}