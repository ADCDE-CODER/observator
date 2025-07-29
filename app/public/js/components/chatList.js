import { renderChatMessages } from "./chatMessages.js";

function renderChatList(chats) {
    if (Array.isArray(chats)) {
        chats.forEach( (chat) => {
            renderChat(chat);
        });
    } else {
        const chat = chats;
        renderChat(chat);
    }
};

function renderChat(chat) {
    const chatMenuContent = document.getElementById("content-main__menuContent");
    if (chatMenuContent) {
        const chatLink = document.createElement("a");
        chatLink.id = chat.id
        chatLink.classList.add("chatsMenu");
        chatLink.innerText = chat.title;

        chatLink.addEventListener("click", () => {
            renderChatMessages(chat.id);
        });

        chatMenuContent.appendChild(chatLink);
    } else {
        console.log(`Chat menu content is ${chatMenuContent}`);
    }
};

export { renderChatList };