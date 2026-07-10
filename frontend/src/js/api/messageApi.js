import { requestApi } from "./requestApi.js";

async function createMessage(token, userInputValue, chatSettings, chatId) {
    const url = "http://localhost:3000/message/prompt";
    const data = {
        userInput: userInputValue, 
        settings: chatSettings, 
        chatId: chatId 
    };
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ data: data })
    });

    return response;
};

async function getMessage(chatId) {
    const data = {
        chatId: chatId 
    };

    return requestApi("http://localhost:3000/message/one", "POST", null, data, "Failed to load chat messages:");
};

export { createMessage, getMessage };