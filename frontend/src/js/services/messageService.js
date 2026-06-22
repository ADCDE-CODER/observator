import { createMessage, getMessage } from "../api/messageApi.js";

async function addMessages(user, userInputValue, token, chatSettings, selectedChatId) {
    if (user) {
        if(!userInputValue.trim()) {
            alert("Please enter a message.");
        } else {        
            const result = await createMessage(token, userInputValue, chatSettings, selectedChatId);
            
            if (result.ok && result.success) {    
                return result.aiMessage;
            } else {
                return `Chat prompt failed: ${result.error} (status: ${result.status})`;
            }   
        }  
    } else {
        alert("No user found!");
    }
};

async function getMessages(user, chatId) {
    if (user) {
        const result = await getMessage(chatId);

        if (result.ok && result.success) {
            return result.chatMessages;
        } else {
            alert(`${result.error} (status: ${result.status})`);
        }
    } else {
        alert("No user found!");
    }
};

export { addMessages, getMessages };