import { renderChat } from "./chat.js";

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

export { renderChatList };