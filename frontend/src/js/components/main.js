import { createWelcomePage } from "./../pages/welcomePage.js";
import { createSignMenuPage } from "./../pages/signMenuPage.js";
import { createChatPage } from "./../pages/chatPage.js";
import { createImagePage } from "./../pages/imagePage.js";
import { createVideoPage } from "./../pages/videoPage.js";
import { createPostPage } from "./../pages/postPage.js";
import { createElement } from "./element.js";
import { authState } from "../state/authState";
import { showPage } from "../pages/showPage.js";

async function createMain() {
    window.addEventListener("popstate", (event) => {
        showPage(event.state.page, false);
    });

    const welcomePage = createWelcomePage(); 
    const signMenuPage = createSignMenuPage();
    let chatPage = await createChatPage(authState.user);
    const imagePage = createImagePage();
    const videoPage = createVideoPage();
    const postPage = createPostPage();

    const main = createElement({tagName: "main", options: {id: "content-main"}});
    main.append(welcomePage, signMenuPage, chatPage, imagePage, videoPage, postPage);

    authState.subscribers(async () => {
        const newChatPage = await createChatPage(authState.user);
        main.replaceChild(newChatPage, chatPage);
        chatPage = newChatPage;

        if (authState.user != null) {
            showPage("chat", true);
        } else {
            showPage("welcome", true);
        }
    });

    return main;
}

export {createMain};