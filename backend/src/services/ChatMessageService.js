export default class ChatMessageService {
    constructor(userChatMessageService, assistantChatMessageService) {
        this.userChatMessageService = userChatMessageService;
        this.assistantChatMessageService = assistantChatMessageService;
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

    create(userChatMessage, assistantChatMessage, chatId) {
        this.userChatMessageService.create(userChatMessage, chatId);
        this.assistantChatMessageService.create(assistantChatMessage, chatId);
    }

    getChatMessages(chatId) {
        const userMessages = this.userChatMessageService.getAll(chatId);
        const assistantMessages = this.assistantChatMessageService.getAll(chatId);
        const chatMessages = this.#sortChatMessagesByCreatedAt(userMessages, assistantMessages);

        return chatMessages;
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