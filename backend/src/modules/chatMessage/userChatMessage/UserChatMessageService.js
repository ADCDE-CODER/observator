export default class UserChatMessageService {
    constructor(UserChatMessageModel) {
        this.userChatMessageModel = UserChatMessageModel;
    }

    create(chatMessageData, chatMessageId) {    
        const { content, images } = chatMessageData;
        
        if (!content && !images) {
            const error = new Error("Content and images are required to create a chat message.");
            error.status = 400;
            throw error;
        }
        
        if (!chatMessageId) {
            throw new Error("ChatMessageId is required to create a chat message.");
        }
    
        try {
            this.userChatMessageModel.create(content, images, chatMessageId);
        } catch (error) {
            throw error;
        }
    }
    
    findByIds(chatMessageIds) {
        if (!chatMessageIds) {
            throw new Error("ChatMessageIds are required to get all chat messages.");
        }

        try {
            return this.userChatMessageModel.findByIds(chatMessageIds);
        } catch (error) {
            throw error;
        }
    }
    
    update(chatMessageData, id, chatMessageId) {  
        const {content, images } = chatMessageData;
        
        if (!content && !images) {
            const error = new Error("Content and images are required to update a chat message.");
            error.status = 400;
            throw error;
        }
        
        if (!id || !chatMessageId ) {
            throw new Error("UserChatMessageId and chatMessageId are required to update a chat message.");
        }

        try {
            const userChatMessage = this.userChatMessageModel.update(content, images, id, chatMessageId);

            if(!userChatMessage) {
                throw new Error("Update failed.");
            }

            return userChatMessage;
        } catch (error) {
            throw error;
        }
    }
    
    delete(id, chatMessageId) {
        if (!id || !chatMessageId) {
            throw new Error("UserChatMessageId and chatMessageId are required to delete a chat message.")
        }

        try {
            this.userChatMessageModel.delete(id, chatMessageId);
        } catch (error) {
            throw error;
        }
    }
}