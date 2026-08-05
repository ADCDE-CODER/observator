export default class AssistantChatMessageService {
    constructor(assistantChatMessageModel) {
        this.assistantChatMessageModel = assistantChatMessageModel;
    }

    create(chatMessageData, chatMessageId) {    
        const { model, thinking, content, images } = chatMessageData;

        if (!content && !images) {
            const error = new Error("Content and images are required to create a chat message.");
            error.status = 400;
            throw error;
        }
        
        if (!chatMessageId) {
            throw new Error("ChatMessageId is required to create a chat message.");
        }
    
        try {
            this.assistantChatMessageModel.create(model, thinking, content, images, chatMessageId);
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
    
    update(chatMessageData, id, chatMessageId) {        
        const { content, images } = chatMessageData;
        
        if (!content && !images) {
            const error = new Error("Content and images are required to update a chat message.");
            error.status = 400;
            throw error;
        }
        
        if (!id || !chatMessageId ) {
            throw new Error("AssistantChatMessageId and chatMessageId are required to update a chat message.");
        }

        try {
            const assistantChatMessage = this.assistantChatMessageModel.update(content, images, id, chatMessageId);

            if(!assistantChatMessage) {
                throw new Error("Update failed.");
            }

            return assistantChatMessage;
        } catch (error) {
            throw error;
        }
    }
    
    delete(id, chatMessageId) {
        if (!id || !chatMessageId) {
            throw new Error("AssistantChatMessageId and chatMessageId are required to delete a chat message.")
        }

        try {
            this.assistantChatMessageModel.delete(id, chatMessageId);
        } catch (error) {
            throw error;
        }
    }
}