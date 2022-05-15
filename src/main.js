import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入全局样式
import '@/assets/scss/index.scss'
// 引入字体图标
import '@/assets/font/iconfont'

// 引入AntD
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

// 注册指令
import clickOutsideDirective from '@/directives/clickOutside'
import clickZoomOutDirective from '@/directives/click_ZoomOut'
import mousehoverZoomDirective from '@/directives/mousehover_Zoom'
import notCurrentlySupportedDirective from '@/directives/notCurrentlySupported'

createApp(App)
    .use(store)
    .use(router)
    .use(Antd)
    .directive('clickOutside', clickOutsideDirective)
    .directive('clickZoomOut', clickZoomOutDirective)
    .directive('mousehoverZoom', mousehoverZoomDirective)
    .directive('notCurrentlySupported', notCurrentlySupportedDirective)
    .mount('#app')
