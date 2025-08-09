import { requestApi } from "./requestApi.js";

async function createMessage(token, userInputValue, chatSettings, chatId) {
    const data = {
        userInput: userInputValue, 
        settings: chatSettings, 
        chatId: chatId 
    };

    return requestApi("http://localhost:3000/message/prompt", "POST", token, data, "Chat prompt error:");
};

async function fetchMessage(chatId) {
    const data = {
        chatId: chatId 
    };

    return requestApi("http://localhost:3000/message/one", "POST", null, data, "Failed to load chat messages:");
};

export { createMessage, fetchMessage };