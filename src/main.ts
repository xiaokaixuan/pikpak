import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import http from './utils/axios'

const app = createApp(App)
app.config.globalProperties.$http = http
app.use(router).mount('#app')
