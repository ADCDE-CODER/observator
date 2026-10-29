import HomePage from "../pages/HomePage.vue";
import ChatPage from "../pages/ChatPage.vue";
import IrisPage from "../pages/IrisPage.vue";
import SignMenuPage from "../pages/SignMenuPage.vue";
import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomePage },
        { path: '/chat', component: ChatPage },
        //{ path: '/iris', component: IrisPage },
        { path: '/sign', component: SignMenuPage }
    ]
});