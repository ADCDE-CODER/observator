import { saveToLocalStorage } from "../utils/localStorage.js";
import { loadMessagesAndReloadChat } from "../services/messageService.js";

function renderChat(chat) {
    const chatMenuContent = document.getElementById("content-main__menuContent");
    if (chatMenuContent) {
        const chatLink = document.createElement("a");
        chatLink.id = chat.id
        chatLink.classList.add("chatsMenu");
        chatLink.innerText = chat.title;

        chatLink.addEventListener("click", () => {
            showActiveChat(chat.id);
            loadMessagesAndReloadChat(chat.id);
        });

        chatMenuContent.appendChild(chatLink);
    } else {
        console.log(`Chat menu content is ${chatMenuContent}`);
    }
};

function showActiveChat(selectedChatId) {
    saveToLocalStorage("selectedChatId", selectedChatId);

    const chatsMenu = document.getElementsByClassName("chatsMenu");
    if (chatsMenu) {
        for (let i = 0; i < chatsMenu.length; i++) {
            chatsMenu[i].classList.remove("active");
        }

        const selectedChat = document.getElementById(selectedChatId);
        selectedChat.classList.add("active");
    } else {
        console.log(`Chat menu is ${chatsMenu}`);
    }    
};

export { renderChat };