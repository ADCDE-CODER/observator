export default class ChatService {
    constructor(chatModel) {
        this.chatModel = chatModel;
    }

    create(chatData, userId) {    
        const { title } = chatData;

        if (!title) {
            const error = new Error("Title is required to create a chat.");
            error.status = 400;
            throw error;
        }
        
        if (!userId) {
            throw new Error("User ID is required to create a chat.");
        }
    
        try {
            this.chatModel.create(title, userId);
        } catch (error) {
            throw error;
        }
    };
    
    getAll(userId) {
        if (!userId) {
            throw new Error("User ID is required to read chat(s).");
        }

        try {
            return this.chatModel.getAll(userId);
        } catch (error) {
            throw error;
        }
    };

    getById(chatId, userId) {
        if (!chatId || !userId) {
            throw new Error("Chat ID and user ID are required to get a chat.");
        }

        try {
            const chat = this.chatModel.findById(chatId, userId);

            if (!chat) {
                const error = new Error("Chat not found.");
                error.status = 404;
                throw error;
            }

            return chat;
        } catch (error) {
            throw error;
        }
    };
    
    update(chatData, chatId, userId) {        
        const { title } = chatData;

        if (!title) {
            const error = new Error("Title is required to update a chat.");
            error.status = 400;
            throw error;
        }
        
        if (!chatId || !userId) {
            throw new Error("Chat ID, and user ID are required to update a chat.");
        }

        try {
            const chat = this.chatModel.update(title, chatId, userId);

            if (!chat) {
                throw new Error("Failed to update chat title");
            }

            return chat;
        } catch (error) {
            throw error;
        }
    };
    
    delete(chatId, userId) {
        if (!chatId || !userId) {
            throw new Error("chat ID and user ID are required to delete a chat.")
        }

        try {
            this.chatModel.delete(chatId, userId);
        } catch (error) {
            throw error;
        }
    };
}