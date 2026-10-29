import ChatMessageAPI from "./ChatMessageApi.js";

export default class ChatMessageService {
    constructor(token) {
        if (!token) {
            throw new Error("Token missing.");
        }

        this.chatMessageApi = new ChatMessageAPI(token);
    }

    async sendMessage(chatId, userChatMessage, onChunk) {    
        if (!chatId) {
            throw new Error("Chat ID missing.");
        }
        
        if (!userChatMessage.content.trim()) {
            throw new Error("Please enter a message.");
        }

        if (!onChunk) {
            throw new Error("Callback missing.");
        }
            
        return await this.chatMessageApi.sendMessage(chatId, userChatMessage, onChunk);
    }

    async getMessages(chatId) {
        if (!chatId) {
            throw new Error("Chat ID missing.");
        }
        
        return await this.chatMessageApi.getMessages(chatId);
    }

    async deleteMessage(chatId, messageId) {
        return this.chatMessageApi.deleteMessage(chatId, messageId);
    }
}

