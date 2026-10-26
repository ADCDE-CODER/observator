import ChatAPI from "./ChatApi";

export default class ChatService {
    constructor(token) {
        if (!token) {
            throw new Error("Token missing.");
        }

        this.chatApi = new ChatAPI(token);
    }

    async createChat(title) {
        return await this.chatApi.create(title);
    }
    
    async getAllChats() {
        return await this.chatApi.getAll();
    }
    
    async updateChat(id, title) {
        if (!id) {
            throw new Error("Chat ID missing.");
        }

        if (title === null) {
            throw new Error("Title is null.");
        }
        
        if (!title.trim()) {
            throw new Error("Please enter a text to change the chat title.");
        }
    
        return await this.chatApi.update(id, title);
    }
    
    async removeChat(id) {
        if (!id) {
            throw new Error("Chat ID missing.");
        }
    
        return await this.chatApi.remove(id);
    }
}
