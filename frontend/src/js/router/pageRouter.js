import WelcomePage from "../pages/WelcomePage.vue";
import ChatPage from "../pages/ChatPage.vue";
import ImagePage from "../pages/ImagePage.vue";
import VideoPage from "../pages/VideoPage.vue";
import PostPage from "../pages/PostPage.vue";
import SignMenuPage from "../pages/SignMenuPage.vue";
import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/welcome', component: WelcomePage },
        { path: '/chat', component: ChatPage },
        { path: '/image', component: ImagePage },
        { path: '/video', component: VideoPage },
        { path: '/post', component: PostPage },
        { path: '/sign', component: SignMenuPage }
    ]
});