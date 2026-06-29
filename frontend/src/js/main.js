import '../assets/styles/main.css'
import App from './App.vue'
import { router } from './router/pageRouter.js';
import { createApp } from 'vue'

const app = createApp(App);
app.use(router);
app.mount('#app');