import { loadFromLocalStorage } from "../utils/localStorage.js";
import { createMessage, getMessage } from "../api/messageApi.js";
import {renderChatMessages} from "../components/chatMessages.js";

async function sendRequestMessage() {
    const user = loadFromLocalStorage("user");
    if (user) {
        const userInput = document.getElementById("prompt-input");
        const userInputValue = userInput.value;

        if(!userInputValue.trim()) {
            alert("Please enter a message.");
        } else {
            const mainOutput = document.getElementById("content-main__output");

            // Collect localStorage values
            const token = loadFromLocalStorage("token");
            const chatSettings = loadFromLocalStorage("chatSettings");
            const selectedChatId = loadFromLocalStorage("selectedChatId");
            
            // Display user's message
            const userParameter = document.createElement("p");
            userParameter.innerText = `${user.email}: ${userInputValue}`;
            mainOutput.appendChild(userParameter);
            
            const result = await createMessage(token, userInputValue, chatSettings, selectedChatId);
            
            const aiParameter = document.createElement("p");
            
            if (result.ok && result.success) {
                // Display AI's message
                aiParameter.innerText = result.aiMessage;
                
                // Clear user's input
                userInput.value = "";
            } else {
                aiParameter.innerText = `Chat prompt failed: ${result.error} (status: ${result.status})`;
            }   

            mainOutput.appendChild(aiParameter); 
        }  
    } else {
        alert("No user found!");
    }
};

async function loadMessagesAndReloadChat(chatId) {
    const user = loadFromLocalStorage("user");
    if (user) {
        const result = await getMessage(chatId);

        if (result.ok && result.success) {
            renderChatMessages(result.chatMessages);
        } else {
            alert(`${result.error} (status: ${result.status})`);
        }
    } else {
        alert("No user found!");
    }
};

export { sendRequestMessage, loadMessagesAndReloadChat };