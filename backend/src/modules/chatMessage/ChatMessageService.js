export default class ChatMessageService {
    constructor(chatMessageModel, userChatMessageService, assistantChatMessageService, aiGenerationService) {
        this.chatMessageModel = chatMessageModel;
        this.userChatMessageService = userChatMessageService;
        this.assistantChatMessageService = assistantChatMessageService;
        this.aiGenerationService = aiGenerationService;
    }

    async *generateResponse(userChatMessage, chatId) {
        const conversationContext = this.getChatMessages("ASC", chatId);
        conversationContext.push({role: userChatMessage.role, content: userChatMessage.content, images: userChatMessage.images});
        const stream = await this.aiGenerationService.generateResponse(conversationContext, chatId);

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
                    yield { done: chunk.done, role: chunk.message.role, model: chunk.model, thinking: "Thinking:\n\n" };
                }

                assistantChatMessage.thinking += chunk.message.thinking;
                yield { done: chunk.done, role: chunk.message.role, model: chunk.model, thinking: chunk.message.thinking };
            } else if (chunk.message.content) {
                if(inThinking) {
                    inThinking = false;
                    assistantChatMessage.content = "\n\nAnswer:\n\n";
                    yield { done: chunk.done, role: chunk.message.role, model: chunk.model, content: "\n\nAnswer:\n" };
                }

                assistantChatMessage.content += chunk.message.content;
                yield { done: chunk.done, role: chunk.message.role, model: chunk.model, content: chunk.message.content };
            }

            if (chunk.done) {
                assistantChatMessage.role = chunk.message.role;
                assistantChatMessage.model = chunk.model;
                assistantChatMessage.createdAt = chunk.created_at;
                yield { done: chunk.done, role: chunk.message.role, model: chunk.model, createdAt: chunk.created_at };
            }
        }

        this.create(userChatMessage, assistantChatMessage, chatId)
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

        const userChatMessageId = this.chatMessageModel.create(userChatMessage.role, userChatMessage.createdAt, chatId).lastInsertRowid;
        const assistantChatMessageId = this.chatMessageModel.create(assistantChatMessage.role, assistantChatMessage.createdAt, chatId).lastInsertRowid;

        this.userChatMessageService.create(userChatMessage, userChatMessageId);
        this.assistantChatMessageService.create(assistantChatMessage, assistantChatMessageId);
    }

    getChatMessages(orderBy, chatId) {
        if (!orderBy || !chatId) {
            throw new Error("OrderBy and chat ID are required to get all chat messages.");
        }

        // Get message order
        const chatMessages = this.chatMessageModel.getAll(orderBy, chatId);
        const userChatMessageIds = chatMessages.filter(message => message.role === "user").map(m => m.id);
        const assistantChatMessageIds = chatMessages.filter(message => message.role === "assistant").map(m => m.id);

        // Batch load children
        const userChatMessages = this.userChatMessageService.findByIds(userChatMessageIds);
        const assistantChatMessages = this.assistantChatMessageService.findByIds(assistantChatMessageIds);

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
    }

    // TODO: Update for user and assistant
    update(userChatMessage, userChatMessageId, assistantChatMessageId, chatId) {
       /*  const userMessage = this.userChatMessageService.update(userChatMessage, userChatMessageId, chatId);
        const assistantMessage = this.assistantChatMessageService.update(assistantChatMessage, assistantChatMessageId, chatId) */
    }

    delete(userChatMessageId, assistantChatMessageId, chatId) {
        this.userChatMessageService.delete(userChatMessageId, chatId);
        this.assistantChatMessageService.delete(assistantChatMessageId, chatId);
    }
}