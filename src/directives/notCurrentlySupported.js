import { message } from 'ant-design-vue';
const notCurrentlySupported = {
    mounted(el) {
        const clickHandler = () => {
            message.warn('该功能暂不支持', 0.5)
        }
        el.__clickHandler__=clickHandler
        el.addEventListener('click', el.__clickHandler__)
    },
    unmounted(el) {
        el.removeEventListener('click', el.__clickHandler__)
        delete el.__clickHandler__
    },
}

export default notCurrentlySupported