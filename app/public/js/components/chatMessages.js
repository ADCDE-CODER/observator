import { saveToLocalStorage } from "../utils/localStorage.js";
import { loadMessagesAndReloadChat } from "../services/messageService.js";

async function renderChatMessages(selectedChatId) {
    saveToLocalStorage("selectedChatId", selectedChatId);

    const chatsMenu = document.getElementsByClassName("chatsMenu");
    for (let i = 0; i < chatsMenu.length; i++) {
       chatsMenu[i].classList.remove("active");
    }

    const selectedChat = document.getElementById(selectedChatId);
    selectedChat.classList.add("active");

    loadMessagesAndReloadChat(selectedChatId);
};

export { renderChatMessages };