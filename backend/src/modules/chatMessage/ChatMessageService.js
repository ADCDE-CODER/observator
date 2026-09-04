export default class ChatMessageService {
    constructor(chatMessageModel, userChatMessageService, assistantChatMessageService, chatMetadataService, aiService) {
        this.chatMessageModel = chatMessageModel;
        this.userChatMessageService = userChatMessageService;
        this.assistantChatMessageService = assistantChatMessageService;
        this.chatMetadataService = chatMetadataService;
        this.aiService = aiService;
    }

    async generateResponse(conversationContext, chatId, onChunk) {
        const metadata = this.chatMetadataService.getById(chatId);
        const stream = await this.aiService.generateMessage(conversationContext, metadata);

        // Stream the content chunk by chunk
        let inThinking = false
        let assistantChatMessage = {};
        for await (const chunk of stream) {
            if (!chunk || !chunk.message) {
                continue;
            }

            if(chunk.message.thinking) {
                if(!inThinking) {
                    inThinking = true;
                    assistantChatMessage.thinking = "Thinking:\n\n";
                    onChunk({ done: chunk.done, role: chunk.message.role, model: chunk.model, thinking: "Thinking:\n\n" });
                }

                assistantChatMessage.thinking += chunk.message.thinking;
                onChunk ({ done: chunk.done, role: chunk.message.role, model: chunk.model, thinking: chunk.message.thinking });
            } else if (chunk.message.content) {
                if(inThinking) {
                    inThinking = false;
                    assistantChatMessage.content = "\n\nAnswer:\n\n";
                    onChunk({ done: chunk.done, role: chunk.message.role, model: chunk.model, content: "\n\nAnswer:\n" });
                }

                assistantChatMessage.content += chunk.message.content;
                onChunk({ done: chunk.done, role: chunk.message.role, model: chunk.model, content: chunk.message.content });
            }

            if (chunk.done) {
                assistantChatMessage.role = chunk.message.role;
                assistantChatMessage.model = chunk.model;
                assistantChatMessage.createdAt = chunk.created_at;
                onChunk({ done: chunk.done, role: chunk.message.role, model: chunk.model, createdAt: chunk.created_at });
            }
        }

        return assistantChatMessage;
    }

    create(userChatMessage, assistantChatMessage, chatId) {
        if (!userChatMessage.role) {
            const error = new Error("User role is required to create a chat message.");
            error.status = 400;
            throw error;
        }

        if (!assistantChatMessage.role) {
            throw new Error("Assistant role is required to create a chat message.");
        }

        try {
            const userConversationId = this.chatMessageModel.create(userChatMessage.role, userChatMessage.createdAt, chatId).lastInsertRowid;
            const assistantConversationId = this.chatMessageModel.create(assistantChatMessage.role, assistantChatMessage.createdAt, chatId).lastInsertRowid;
    
            const userChatMessageId = this.userChatMessageService.create(userChatMessage, userConversationId).lastInsertRowid;
            this.assistantChatMessageService.create(assistantChatMessage, assistantConversationId, userChatMessageId);   
        } catch (error) {
            throw error;
        }
    }

    getChatMessages(orderBy, chatId) {
        if (!orderBy || !chatId) {
            throw new Error("OrderBy and chat ID are required to get all chat messages.");
        }

        const chatMessages = this.chatMessageModel.getAll(orderBy, chatId);   
        return this.mergeUserAndAssistantMessages(chatMessages);
    }

    getChatMessagesBySequence(orderBy, sequence, chatId) {
        if (!orderBy || !sequence || !chatId) {
            throw new Error("OrderBy, sequence, and chat ID are required to get all sequence chat messages.");
        }

        const chatMessages = this.chatMessageModel.getAllBySequence(orderBy, sequence, chatId);
        return this.mergeUserAndAssistantMessages(chatMessages);
    }

    mergeUserAndAssistantMessages(chatMessages) {
        try {
            const userChatMessageIds = chatMessages.filter(message => message.role === "user").map(m => m.id);
            const assistantChatMessageIds = chatMessages.filter(message => message.role === "assistant").map(m => m.id);
    
            // Batch load children
            const userChatMessages = this.userChatMessageService.getByIds(userChatMessageIds);
            const assistantChatMessages = this.assistantChatMessageService.getByIds(assistantChatMessageIds);
    
            // Create lookup maps
            const userMap = new Map();
            const assistantMap = new Map();
    
            for (const user of userChatMessages) {
                userMap.set(user.chatmessage_id, user);
            }
    
            for (const assistant of assistantChatMessages) {
                assistantMap.set(assistant.chatmessage_id, assistant);
            }
    
            // Return chat messages with user and assistant
            return chatMessages.flatMap(chatMessage => {
                if (chatMessage.role === "user") {
                    const userChatMessage = userMap.get(chatMessage.id);
    
                    if (!userChatMessage) {
                        return [];
                    }
                    
                    return {
                        id: chatMessage.id,
                        role: chatMessage.role,
                        createdAt: chatMessage.created_at,
                        content: userChatMessage.content,
                        images: userChatMessage.images,
                        chatId: chatMessage.chat_id
                    };
                }
                
                if (chatMessage.role === "assistant") {
                    const assistantChatMessage = assistantMap.get(chatMessage.id);
    
                    if (!assistantChatMessage) {
                        return [];
                    }
    
                    return {
                        id: chatMessage.id,
                        role: chatMessage.role,
                        createdAt: chatMessage.created_at,
                        model: assistantChatMessage.model,
                        thinking: assistantChatMessage.thinking,
                        content: assistantChatMessage.content,
                        images: assistantChatMessage.images,
                        chatId: chatMessage.chat_id
                    };
                }
    
                return [];
            });
        } catch (error) {
            throw error;
        }
    }

    getById(id, chatId) {
        if (!id || !chatId) {
            throw new Error("Chat message ID and chat ID are required to get a chat message.");
        }

        try {
            const chatMessage = this.chatMessageModel.findById(id, chatId);

            if (!chatMessage) {
                const error = new Error("Chat message not found.");
                error.status = 404;
                throw error;
            }

            return chatMessage;
        } catch (error) {
            throw error;
        }
    }

    updateUserMessage(userChatMessage, id, chatId) {
        if (!userChatMessage.role || !userChatMessage.updatedAt) {
            const error = new Error("User role and updated at are required to update the chat message.");
            error.status = 400;
            throw error;
        }

        const chatMessage = this.chatMessageModel.findById(id, chatId);

        if (!chatMessage) {
            throw new Error("Message not found");
        }

        if (chatMessage.role !== "user") {
            throw new Error("Only user messages can be edited");
        }

        this.chatMessageModel.update(userChatMessage.role, userChatMessage.updatedAt, id, chatId);
        this.userChatMessageService.update(userChatMessage, id);

        return this.getChatMessagesBySequence("ASC", chatMessage.sequence, chatId);
    }

    updateAssistantMessage(assistantChatMessage, id, chatId) {
        if (!assistantChatMessage.role) {
            throw new Error("Assistant role is required to update the chat message.");
        }

        const assistantMessageIds = this.assistantChatMessageService.getMessageIdsByUserMessageId(id);
        for (const assistantMessageId of assistantMessageIds) {
            this.chatMessageModel.update(assistantChatMessage.role, assistantChatMessage.updatedAt, assistantMessageId, chatId);
            this.assistantChatMessageService.update(assistantChatMessage, assistantMessageId);
        }
    }

    delete(id, chatId) {
        if (!id || !chatId) {
            throw new Error("Chat message ID and chat ID are required to delete a chat.");
        }

        try {
            // Find all AI replies.
            const assistantMessageIds = this.assistantChatMessageService.getMessageIdsByUserMessageId(id);
    
            // Delete each AI parent Message.
            for (const assistantMessageId of assistantMessageIds) {
                this.chatMessageModel.delete(assistantMessageId, chatId);
            }
    
            // Delete the user parent Message.
            this.chatMessageModel.delete(id, chatId);
        } catch (error) {
            throw error;
        }
    }
}