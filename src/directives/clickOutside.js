// 点击空白指令
export default {
    mounted(el, binding) {
        const documentHandler = (e) => {
            // 判断绑定指令的节点是否包含触发事件的节点
            if (el.contains(e.target)) return false
            // 调用指令绑定的回调函数
            if (binding.value) {
                binding.value(e)
            }
        }
        document.addEventListener('click', documentHandler)
        el.__clickOutside__ = documentHandler
    },
    unmounted(el) {
        document.removeEventListener('click', el.__clickOutside__)
        delete el.__clickOutside__
    },
}