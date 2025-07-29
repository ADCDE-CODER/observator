import { renderChatMessages } from "./chatMessages.js";

function renderChatList(chats) {
    const chatMenuContent = document.getElementById("content-main__menuContent");
    if (chatMenuContent) {
        chats.forEach( (chat) => {                    
            const chatLink = document.createElement("a");
            chatLink.id = chat.id
            chatLink.classList.add("chatsMenu");
            chatLink.innerText = chat.title;

            chatLink.addEventListener("click", () => {
                renderChatMessages(chat.id);
            });

            chatMenuContent.appendChild(chatLink);
        });
    } else {
        console.log(`Chat menu content is ${chatMenuContent}`);
    }
};

export { renderChatList };