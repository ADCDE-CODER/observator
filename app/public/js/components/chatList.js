import { renderChat, clearChat } from "./chat.js";

function renderChatList(chats) {
    if (Array.isArray(chats)) {
        clearChat();
        chats.forEach( (chat) => {
            renderChat(chat);
        });
    } else {
        const chat = chats;
        renderChat(chat);
    }
};

export { renderChatList };