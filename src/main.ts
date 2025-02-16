import {createApp} from 'vue'
import {createPinia} from "pinia";
import App from './App.vue'
import router from '@/router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import '@/assets/styles/index.scss'
import '@icon-park/vue-next/styles/index.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(router).use(pinia)
app.mount('#app')
