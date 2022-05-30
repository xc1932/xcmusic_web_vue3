import { createApp } from 'vue'
import store from '../store'
import clickOutsideDirective from '@/directives/clickOutside'
import MessageBox from '@/components/base/MessageBox.vue'
import PlaylistMenubar from '@/components/base/PlaylistMenubar.vue'

// 1.messagebox组件
// type:    0:success 1:warn
function messagebox(data, msgBoxType = 0) {
    let msg, duration = 1000
    typeof data == 'object' ? { msg, duration=1000 } = data : msg = data
    let mb = createApp(MessageBox, { msgBoxType, msg })
    // 创建一个元素 插入到body中
    let divElement = document.createElement('div')
    document.body.appendChild(divElement)
    // 元素挂载  
    mb.mount(divElement)

    const timer = setTimeout(() => {
        // 卸载组件
        mb.unmount()
        // 删除插入到body的元素
        document.body.removeChild(divElement)
        // 清除定时器
        clearTimeout(timer)
    }, duration)
}

messagebox.success = (data) => {
    messagebox(data)
}

messagebox.warn = (data) => {
    messagebox(data, 1)
}

// 2.用户歌单菜单栏 (单例模式)
let playlistMenubarInstance = null, divEl = null
const playlistMenubar = ({ menubarTop = 0, menubarLeft = 0 }) => {
    if (playlistMenubarInstance) {
        playlistMenubarInstance.unmount()
        divEl.remove()
    }
    playlistMenubarInstance = createApp(PlaylistMenubar, { menubarTop, menubarLeft })
    playlistMenubarInstance.use(store).directive('clickOutside', clickOutsideDirective)
    divEl = document.createElement('div')
    document.body.appendChild(divEl)
    playlistMenubarInstance.mount(divEl)
}

export { messagebox, playlistMenubar }