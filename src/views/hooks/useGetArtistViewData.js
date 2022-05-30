import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import * as moment from 'moment'
import {
    getArtistSingle,
    getArtistAlbum,
    getArtistMV,
    getSimilarArtist,
    likeAArtist
} from '@/api/artist'
import { messagebox } from "@/utils/customComponent";
import useHomeViewControls from "@/views/hooks/useHomeViewControls";

// 关闭moment警告
moment.suppressDeprecationWarnings = true;

export default function useGetArtisViewData(artistId) {
    // vuex
    const store = useStore()
    const userLikeArtists = computed(() => store.getters.getLikedArtists)
    const currentId = computed(() => store.getters.getCurSong.id)

    // hooks
    const { accessCompleteDataOfSongs } = useHomeViewControls();

    // data
    // 1.页面基础的展示数据
    const basicInfo = ref(null)
    const latestRelease = ref({})
    const hotSongs = ref([])
    const albums = ref([])
    const mvs = ref([])
    const singleAndEPs = ref([])
    const similarArtists = ref([])
    const hotSongsIds = ref([])
    const completeHotSongsData = ref([])
    // 2.others
    const focusOn = ref(false)

    // init data
    const task1 = getArtistSingle({ id: artistId })
    const task2 = getArtistAlbum({ id: artistId })
    const task3 = getArtistMV({ id: artistId })
    const task4 = getSimilarArtist({ id: artistId })
    Promise.all([task1, task2, task3, task4]).then(res => {
        if (res[0].code === 200) {
            // 1.basicInfo(歌手基本信息)
            const artist = res[0].artist
            basicInfo.value = {
                id: artist.id,
                avatar: artist.picUrl,
                name: artist.name,
                musicSize: artist.musicSize,
                albumSize: artist.albumSize,
                mvSize: artist.mvSize,
                briefDesc: artist.briefDesc,
                followed: artist.followed
            }
            // 2.hotSongs(歌手热门歌曲)
            const artistHotSongs = res[0].hotSongs
            hotSongs.value = artistHotSongs.map(hs => {
                return {
                    id: hs.id,
                    hsName: hs.name,
                    hsAlbumId: hs.al.id,
                    hsAlbumCover: hs.al.picUrl,
                    hsAlbumName: hs.al.name
                }
            })
            // 3.hotSongsIds(歌手热门歌曲id数组)
            hotSongsIds.value = hotSongs.value.map(hs => hs.id)
        }
        if (res[1].code === 200) {
            // 1.albums(歌手专辑数据)
            const typeArr = ['EP/Single', 'EP', 'Single', '合集']
            const realAlbums = res[1].hotAlbums.filter(a => a.type === '专辑')
            const realSingleAndEPs = res[1].hotAlbums.filter(a => typeArr.includes(a.type))
            albums.value = realAlbums.map(a => {
                return {
                    id: a.id,
                    albumCover: a.picUrl,
                    albumName: a.name,
                    albumType: a.type,
                    albumPublishTime: moment(a.publishTime).format('YYYY年MM月DD日'),
                    size: a.size
                }
            })
            // 2.singleAndEPs(歌手的EP和单曲)
            singleAndEPs.value = realSingleAndEPs.map(a => {
                return {
                    id: a.id,
                    albumCover: a.picUrl,
                    albumName: a.name,
                    albumType: a.type,
                    albumPublishTime: moment(a.publishTime).format('YYYY年MM月DD日'),
                    size: a.size
                }
            })
            // 3.latestRelease(最新发布的专辑)
            if (res[1].hotAlbums.length > 0) {
                const latestOne = res[1].hotAlbums.sort((a, b) => b.publishTime - a.publishTime)[0]
                latestRelease.value.latestAlbum = {
                    id: latestOne.id,
                    albumCover: latestOne.picUrl,
                    albumName: latestOne.name,
                    albumType: latestOne.type,
                    albumPublishTime: moment(latestOne.publishTime).format('YYYY年MM月DD日'),
                    size: latestOne.size
                }
            }
        }
        if (res[2].code === 200) {
            // 1.mvs(歌手mv数据)
            const artistMV = res[2].mvs
            mvs.value = artistMV.map(mv => {
                return {
                    id: mv.id,
                    mvName: mv.name,
                    mvCover: mv.imgurl,
                    mvPublishTime: moment(mv.publishTime).format('YYYY年MM月DD日')
                }
            })
            // 2.latestRelease(最新发布的MV)
            if (mvs.value.length > 0) {
                latestRelease.value.latestMV = mvs.value[0]
            }
        }
        if (res[3].code === 200) {
            // 1.similarArtists(相似歌手)
            const artists = res[3].artists
            similarArtists.value = artists.map(sr => {
                return {
                    id: sr.id,
                    artistName: sr.name,
                    artistAvatar: sr.picUrl
                }
            })
        }
    })

    // watch
    // 计算关注状态
    watch(userLikeArtists, newVal => {
        focusOn.value = newVal.map(a => a.id).includes(artistId)
    })

    // 获取热门歌曲的详细播放信息
    watch(hotSongsIds, newVal => {
        if (newVal.length === 0) {
            messagebox.warn("没有可以播放的歌曲");
        } else {
            accessCompleteDataOfSongs(newVal, completeHotSongsData)
        }
    })

    // methods
    // 1.播放所有热门歌曲
    const playbtnClick = () => {
        store.dispatch("setPlayerPlaylistOnly", completeHotSongsData.value);
    }
    // 2.点击关注歌手
    const focusbtnClick = (artistId) => {
        let t = 1;
        if (focusOn.value) {
            t = 2;
        }
        likeAArtist({ t, id: artistId }).then((res) => {
            if (res.code === 200) {
                // 重新拉取数据
                if (t === 1) {
                    focusOn.value = true
                    messagebox.success("收藏成功");
                } else {
                    focusOn.value = false
                    messagebox.success("取消收藏成功");
                }
                store.dispatch("setLikedArtists");
            } else {
                if (t === 1) {
                    messagebox.warn("收藏失败");
                } else {
                    messagebox.warn("取消收藏失败");
                }
            }
        });
    }
    return {
        // vuex
        currentId,
        // data
        basicInfo,
        latestRelease,
        hotSongs,
        albums,
        mvs,
        singleAndEPs,
        similarArtists,
        focusOn,
        completeHotSongsData,
        playbtnClick,
        focusbtnClick,
    }
}