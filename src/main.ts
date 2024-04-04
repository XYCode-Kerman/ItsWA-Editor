import axios from 'axios'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/global.css'
import router from './router'
import store from './store'

createApp(App).use(store).use(router).mount('#app')

// dev
axios.defaults.baseURL = 'http://localhost:2568/'