import { createMessage, getMessage } from "../api/messageApi.js";

export async function addMessages(userChatMessage, chatId, userToken, onChunk) {    
    if (!userChatMessage.content.trim()) {
        throw new Error("Please enter a message.");
    }

    if (!chatId) {
        throw new Error("Chat ID missing.");
    }

    if (!userToken) {
        throw new Error("User token missing.");
    }

    if (!onChunk) {
        throw new Error("Callback missing.");
    }
        
    createMessage(userChatMessage, chatId, userToken, onChunk);
};

export async function getMessages(chatId, userToken) {
    if (!chatId) {
        throw new Error("Chat ID missing.");
    }

    if (!userToken) {
        throw new Error("User token missing.");
    }
    
    return await getMessage(chatId, userToken);
};