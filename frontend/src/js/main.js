import '../assets/styles/main.css'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/base16/dracula.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App.vue'
import { router } from './router/pageRouter.js';
import { createApp } from 'vue'

const app = createApp(App);
app.use(router);
app.mount('#app');