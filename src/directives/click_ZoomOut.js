// 点击缩小，松开回单按钮
export default {
    mounted(el, binding) {
        // 设置缩小比例
        let zoomOutScale = 0.9
        if (binding.arg) {
            zoomOutScale = binding.arg
        }
        // 设置过度
        el.style.transition = 'transform 0.5s'
        el.style.cursor='pointer'
        // 绑定鼠标按下和抬起的事件
        const zoomOutHandler = function () {
            this.style.transform = `scale(${zoomOutScale})`
        }
        const zoomInHandler = function () {
            this.style.transform = 'scale(1)'
        }
        el.addEventListener('mousedown', zoomOutHandler)
        el.addEventListener('mouseup', zoomInHandler)
        el.__zoomOutHandler__ = zoomOutHandler
        el.__zoomInHandler__ = zoomInHandler

    },
    unmounted(el) {
        // 解绑事件并删除el上的属性
        el.removeEventListener('mousedown', el.__zoomOutHandler__)
        el.removeEventListener('mouseup', el.__zoomInHandler__)
        delete el.__zoomOutHandler__
        delete el.__zoomInHandler__
    },
}