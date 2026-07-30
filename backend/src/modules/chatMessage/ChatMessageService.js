export default class ChatMessageService {
    constructor(userChatMessageService, assistantChatMessageService, aiGenerationService) {
        this.userChatMessageService = userChatMessageService;
        this.assistantChatMessageService = assistantChatMessageService;
        this.aiGenerationService = aiGenerationService;
    }

    #sortChatMessagesByCreatedAt(userMessages, assistantMessages, direction = "asc") {
        const chatMessages = [
            ...userMessages,
            ...assistantMessages
        ];

        // Sort by created at 
        return chatMessages.sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);

            if (direction === "asc") {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });
    }

    async *generateResponse(userChatMessage, chatId) {
        const conversationContext = this.getChatMessages(chatId);
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
        this.userChatMessageService.create(userChatMessage, chatId);
        this.assistantChatMessageService.create(assistantChatMessage, chatId);
    }

    getChatMessages(chatId) {
        const userMessages = this.userChatMessageService.getAll(chatId);
        const assistantMessages = this.assistantChatMessageService.getAll(chatId);
        const chatMessages = this.#sortChatMessagesByCreatedAt(userMessages, assistantMessages);

        const cleanedChatMessages = chatMessages.map(chatMessage => {
            const { created_at, chat_id, ...rest } = chatMessage;

            return {
                ...rest,
                chatId: chat_id,
                createdAt: created_at
            };
        });

        return cleanedChatMessages;
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