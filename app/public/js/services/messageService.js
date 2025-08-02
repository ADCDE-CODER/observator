import { loadFromLocalStorage } from "../utils/localStorage.js";
import { createMessage } from "../api/messageApi.js";

async function sendRequestMessage() {
    const userInput = document.getElementById("prompt-input");
    const userInputValue = userInput.value;

    if(!userInputValue.trim()) {
        alert("Please enter a message.");
    } else {
        const mainOutput = document.getElementById("content-main__output");

        // Collect localStorage values
        const user = loadFromLocalStorage("user");
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
};

export { sendRequestMessage };