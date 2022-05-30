import { computed } from 'vue'
import { useStore } from 'vuex'
import _ from "lodash";
import { likeSong } from "@/api/user";

export default function useLikeSong() {
    const store = useStore()
    const likedSongs = computed(() => store.getters.getLikedSongs);
    const userId = computed(() => store.getters.getUserID);

    // 喜欢/取消喜欢 歌曲
    const likeASong = _.debounce((curId) => {
        const likedSongsArr = likedSongs.value;
        if (likedSongsArr.includes(curId)) {
            //先提交vuex,后发请求体验更好
            store.commit("UPDTAE_LIKEDSONGS", { op: 1, newId: curId });
            likeSong({ id: curId, like: false }).then((res) => {
                if (res.code === 405) {
                    message.error(res.message);
                    return
                }
                // 重新拉取数据(必须在likeSong完成后,不然拉取的仍然是之前的数据)
                if (userId.value == null) return;
                store.dispatch("setLikedSongs");
            });
        } else {
            store.commit("UPDTAE_LIKEDSONGS", { op: 0, newId: curId });
            likeSong({ id: curId }).then((res) => {
                if (res.code === 405) {
                    message.error(res.message);
                    return
                }
                // 重新拉取数据
                if (userId.value == null) return;
                store.dispatch("setLikedSongs");
            });
        }

    }, 500);

    return {
        likeASong
    }
}