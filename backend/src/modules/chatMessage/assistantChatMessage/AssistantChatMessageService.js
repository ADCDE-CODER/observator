export default class AssistantChatMessageService {
    constructor(assistantChatMessageModel) {
        this.assistantChatMessageModel = assistantChatMessageModel;
    }

    create(chatMessageData, chatMessageId, userChatMessageId) {    
        const { model, thinking, content, images } = chatMessageData;

        if (!content && !images) {
            const error = new Error("Content and images are required to create a chat message.");
            error.status = 400;
            throw error;
        }
        
        if (!chatMessageId || !userChatMessageId) {
            throw new Error("ChatMessageId and userChatMessageId are required to create a chat message.");
        }
    
        try {
            this.assistantChatMessageModel.create(model, thinking, content, images, chatMessageId, userChatMessageId);
        } catch (error) {
            throw error;
        }
    }
    
    findByIds(chatMessageIds) {
        if (!chatMessageIds) {
            throw new Error("ChatMessageIds are required to get all chat messages.");
        }

        try {
            return this.assistantChatMessageModel.findByIds(chatMessageIds);
        } catch (error) {
            throw error;
        }
    }

    findMessageIdsByUserMessageId(userChatMessageId) {
        if (!userChatMessageId) {
            throw new Error("UserChatMessageId is required to get all assistant ID:s.");
        }

        try {
            return this.assistantChatMessageModel.findMessageIdsByUserMessageId(userChatMessageId);
        } catch (error) {
            throw error;
        }
    }
    
    update(chatMessageData, chatMessageId) {        
        const { content, images } = chatMessageData;
        
        if (!content && !images) {
            const error = new Error("Content and images are required to update a chat message.");
            error.status = 400;
            throw error;
        }
        
        if (!chatMessageId ) {
            throw new Error("ChatMessageId is required to update a chat message.");
        }

        try {
            const assistantChatMessage = this.assistantChatMessageModel.update(content, images, chatMessageId);

            if(!assistantChatMessage) {
                throw new Error("Update failed.");
            }

            return assistantChatMessage;
        } catch (error) {
            throw error;
        }
    }
    
    delete(chatMessageId, userChatMessageId) {
        if (!chatMessageId || !userChatMessageId) {
            throw new Error("ChatMessageId and userChatMessageId are required to delete a chat message.")
        }

        try {
            this.assistantChatMessageModel.delete(chatMessageId, userChatMessageId);
        } catch (error) {
            throw error;
        }
    }
}