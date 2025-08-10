import { saveToLocalStorage } from "../utils/localStorage.js";
import { getMessage } from "../api/messageApi.js";

async function renderChatMessages(selectedChatId) {
    saveToLocalStorage("selectedChatId", selectedChatId);
    const output = document.getElementById("content-main__output");
    output.innerHTML = "";

    const chatsMenu = document.getElementsByClassName("chatsMenu");

    for (let i = 0; i < chatsMenu.length; i++) {
       chatsMenu[i].classList.remove("active");
    }

    const selectedChat = document.getElementById(selectedChatId);
    selectedChat.classList.add("active");

    const result = await getMessage(selectedChatId);

    if (result.ok && result.success) {
        result.chatMessages.forEach( (chatMessage) => {                    
            const chatParameter = document.createElement("p");
            chatParameter.textContent = `${chatMessage.message}`;
            output.appendChild(chatParameter);
        });
        
        console.log(result.message);
    } else {
        alert(`${result.error} (status: ${result.status})`);
    }
};

export { renderChatMessages };