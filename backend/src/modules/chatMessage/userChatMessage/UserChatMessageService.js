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
            return this.userChatMessageModel.create(content, images, chatMessageId);
        } catch (error) {
            throw error;
        }
    }
    
    getByIds(chatMessageIds) {
        if (!chatMessageIds) {
            throw new Error("ChatMessageIds are required to get all chat messages.");
        }

        try {
            return this.userChatMessageModel.findByIds(chatMessageIds);
        } catch (error) {
            throw error;
        }
    }
    
    update(chatMessageData, chatMessageId) {  
        const {content, images } = chatMessageData;
        
        if (!content && !images) {
            const error = new Error("Content and images are required to update a chat message.");
            error.status = 400;
            throw error;
        }
        
        if (!chatMessageId ) {
            throw new Error("ChatMessageId is required to update a chat message.");
        }

        try {
            const userChatMessage = this.userChatMessageModel.update(content, images, chatMessageId);

            if(!userChatMessage) {
                throw new Error("Update failed.");
            }

            return userChatMessage;
        } catch (error) {
            throw error;
        }
    }
    
    delete(chatMessageId) {
        if (!chatMessageId) {
            throw new Error("ChatMessageId is required to delete a chat message.")
        }

        try {
            this.userChatMessageModel.delete(chatMessageId);
        } catch (error) {
            throw error;
        }
    }
}