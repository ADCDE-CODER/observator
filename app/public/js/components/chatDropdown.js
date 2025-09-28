import { updateChatAndReloadMenu, deleteChatAndReloadMenu } from "../services/chatService.js";

function createChatDropdown(chatId) {
    // Create elements
    const chatDropdown = document.createElement("div");
    const dropdownButton = document.createElement("button");
    const dropdownContent = document.createElement("div");

    // Assign ID:s
    chatDropdown.id = "chat-dropdown";
    dropdownButton.id = "chat-dropdown__button"
    dropdownContent.id = "chat-dropdown__content";
    
    // Set property
    dropdownButton.innerText = "...";
    dropdownContent.style.display = "none";
    
    // Listning for a dropdown button is pressed to show a dropdown 
    dropdownButton.addEventListener("click", (event) => {
        event.stopPropagation();
        if (dropdownContent.style.display === "none") {
            dropdownContent.style.display = "flex";
            //dropdownButton.style.backgroundColor = "#ffffff1f";
        } else {
            dropdownContent.style.display = "none";
            //dropdownButton.style.backgroundColor = "transparent";
        }
    });

    // Listning for when cursor is pressed outside of dropdown element, then hide a dropdown
    document.addEventListener("click", (event) => {
        if (!dropdownContent.contains(event.target) && !dropdownButton.contains(event.target)) {
            dropdownContent.style.display = "none";
            //dropdownButton.style.backgroundColor = "transparent";
        }
    });
   
    const renameMenu = createDropdownMenu("Rename", () => { 
        const title = prompt("Please enter to change chat title");
        if (title) {
            console.log(title);
            updateChatAndReloadMenu(chatId, title);
        } else {
            return;
        }
    });

    const deleteMenu = createDropdownMenu("Delete", () => { 
        if (confirm("Do you want delete chat and messages forever?")) {
            deleteChatAndReloadMenu(chatId);
        } else {
            return;
        }
    });
    
    dropdownContent.appendChild(renameMenu);
    dropdownContent.appendChild(deleteMenu);

    chatDropdown.appendChild(dropdownButton);
    chatDropdown.appendChild(dropdownContent);

    return chatDropdown;
};

function createDropdownMenu(name, handler) {
    const dropdownMenu = document.createElement("a");
    dropdownMenu.innerText = name;
    dropdownMenu.addEventListener("click", handler);
    
    return dropdownMenu;
};

export { createChatDropdown };