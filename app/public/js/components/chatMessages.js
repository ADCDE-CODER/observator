import { saveToLocalStorage } from "../utils/localStorage.js";
import { getMessages } from "../services/messageService.js";

async function renderChatMessages(selectedChatId) {
    saveToLocalStorage("selectedChatId", selectedChatId);

    const chatsMenu = document.getElementsByClassName("chatsMenu");
    for (let i = 0; i < chatsMenu.length; i++) {
       chatsMenu[i].classList.remove("active");
    }

    const selectedChat = document.getElementById(selectedChatId);
    selectedChat.classList.add("active");

    const chatMessages = await getMessages(selectedChatId);
    if (chatMessages) {
        const mainOutput = document.getElementById("content-main__output");
        if (mainOutput) {
            mainOutput.innerHTML = "";
            chatMessages.forEach( (chatMessage) => {
                const chatParameter = document.createElement("p");
                chatParameter.textContent = `${chatMessage.message}`;
                mainOutput.appendChild(chatParameter);
            });
        } else {
            console.log(`Main output is ${mainOutput}`);
        }
    } else {
        console.log(`Chat messages is ${chatMessages}`);
    }
};

export { renderChatMessages };