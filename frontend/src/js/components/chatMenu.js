import { createChatDropdown } from "./chatDropdown.js";
import { createButton } from "./button.js";
import { authState } from "../state/authState.js";

function createChatMenu({tagName = "a", chat = null, dropdownLists = {}, options = {className: ""}, onClick = null}) {    
    const {className} = options;
    const chatLink = createButton({tagName, textContext: chat.title, options: {className, id: chat.id}, onClick});
    const dropdown = createChatDropdown({chatId: chat.id, lists: dropdownLists});
    chatLink.appendChild(dropdown);

    return chatLink;
};

function showActiveChatMenu(selectedChatId, className) {
    authState.setSelectedChatId(selectedChatId);

    const chatsMenu = document.getElementsByClassName(className);
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

export { createChatMenu, showActiveChatMenu };