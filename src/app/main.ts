/**
 * Module: App Entry
 * 应用入口 - 组装所有模块
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { setupErrorHandler } from '@/services/error-handler'
import '@/styles/global.css'

const app = createApp(App)
setupErrorHandler(app)
app.use(createPinia())
app.use(router)
app.mount('#app')
