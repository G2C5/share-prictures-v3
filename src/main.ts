import { createApp } from 'vue'

import pinia from "@/store/store"
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import * as API from './api/api';
import SvgIcon from './components/SvgIcon.vue'
import Splabel from './components/Splabel.vue'
import JoinUs from './components/JoinUs.vue'
import './assets/icons/iconfont.js'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
const app = createApp(App)
app.config.globalProperties.$http = API
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(pinia)
app.use(router)
app.component('SvgIcon', SvgIcon);
app.component('Splabel', Splabel);
app.component('JoinUs', JoinUs);
app.mount('#app')
