const mouseover_Zoom = {
    mounted(el, binding) {
        // 默认放大
        let zoomScale = 1.1
        if (binding.arg) {
            zoomScale = binding.arg
        }
        // 设置过度
        el.style.transition='transform 0.5s'
        el.style.cursor='pointer'
        // 绑定事件
        const mouseenterHandler=function(){
            this.style.transform=`scale(${zoomScale})`
        }
        const mouseleaveHandler=function(){
            this.style.transform=`scale(1)`
        }
        el.__mouseenterHandler__=mouseenterHandler
        el.__mouseleaveHandler__=mouseleaveHandler
        el.addEventListener('mouseenter',mouseenterHandler)
        el.addEventListener('mouseleave',mouseleaveHandler)
    },
    unmounted(el) {
        el.removeEventListener('mouseenter',el.__mouseenterHandler__)
        el.removeEventListener('mouseleave',el.__mouseleaveHandler__)
        delete el.__mouseenterHandler__
        delete el.__mouseleaveHandler__
    },
}
export default mouseover_Zoom