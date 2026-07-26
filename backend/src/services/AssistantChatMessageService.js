export default class AssistantChatMessageService {
    constructor(assistantChatMessage) {
        this.assistantChatMessage = assistantChatMessage;
    }

    create(chatMessageData, chatId) {    
        const { role, model, thinking, content, images, createdAt } = chatMessageData;

        if (!role || !content && !images) {
            const error = new Error("Role, content, and images are required to create a chat message.");
            error.status = 400;
            throw error;
        }
        
        if (!chatId) {
            throw new Error("Chat ID is required to create a chat message.");
        }
    
        try {
            this.assistantChatMessage.create(role, model, thinking, content, images, createdAt, chatId);
        } catch (error) {
            throw error;
        }
    };
    
    getAll(chatId) {
        if (!chatId) {
            throw new Error("Chat ID is required to read chat message(s).");
        }

        try {
            return this.assistantChatMessage.getAll(chatId);
        } catch (error) {
            throw error;
        }
    };
    
    update(chatMessageData, chatMessageId, chatId) {        
        const { role, content, images } = chatMessageData;
        
        if (!role || !content && !images) {
            const error = new Error("Role, content, and images are required to update a chat message.");
            error.status = 400;
            throw error;
        }
        
        if (!chatMessageId || !chatId ) {
            throw new Error("Chat message ID and chat ID are required to update a chat message.");
        }

        try {
            const assistantChatMessage = this.assistantChatMessage.update(role, content, images, chatMessageId, chatId);

            if(!assistantChatMessage) {
                throw new Error("Update failed.");
            }

            return assistantChatMessage;
        } catch (error) {
            throw error;
        }
    };
    
    delete(chatMessageId, chatId) {
        if (!chatMessageId || !chatId) {
            throw new Error("chat message ID and chat ID are required to delete a chat message.")
        }

        try {
            this.assistantChatMessage.delete(chatMessageId, chatId);
        } catch (error) {
            throw error;
        }
    };
}