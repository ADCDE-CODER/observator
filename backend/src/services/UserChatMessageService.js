export default class UserChatMessageService {
    constructor(UserChatMessage) {
        this.userChatMessage = UserChatMessage;
    }

    create(chatMessageData, chatId) {    
        const { role, content, images } = chatMessageData;
        
        if (!role || !content && !images) {
            const error = new Error("Role, content, and images are required to create a chat message.");
            error.status = 400;
            throw error;
        }
        
        if (!chatId) {
            throw new Error("Chat ID is required to create a chat message.");
        }
    
        try {
            this.userChatMessage.create(role, content, images, chatId);
        } catch (error) {
            throw error;
        }
    };
    
    getAll(chatId) {
        if (!chatId) {
            throw new Error("Chat ID is required to read chat message(s).");
        }

        try {
            return this.getAll(chatId);
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
            const userChatMessage = this.userChatMessage.update(role, content, images, chatMessageId, chatId);

            if(!userChatMessage) {
                throw new Error("Update failed.");
            }

            return userChatMessage;
        } catch (error) {
            throw error;
        }
    };
    
    delete(chatMessageId, chatId) {
        if (!chatMessageId || !chatId) {
            throw new Error("Chat message ID and chat ID are required to delete a chat message.")
        }

        try {
            this.userChatMessage.delete(chatMessageId, chatId);
        } catch (error) {
            throw error;
        }
    };
}