import { db } from "../config/database.js";
import UserChatMessageModel from "../modules/chatMessage/UserChatMessageModel.js";
import AssistantChatMessageModel from "../modules/chatMessage/AssistantChatMessageModel.js";

export function verifyChatMessageOwner(req, res, next) {
    const chatId = req.chat.id;
    const chatMessageId = Number(req.params.chatMessageId);
    
    try {
        const userChatMessageModel = new UserChatMessageModel(db);
        const assistantChatMessageModel = new AssistantChatMessageModel(db);
        const userChatMessage = userChatMessageModel.findById(chatMessageId, chatId);
        const assistantChatMessage = assistantChatMessageModel.findById(chatMessageId, chatId);

        if (!userChatMessage || !assistantChatMessage) {
            throw new Error("Chat message not found or user does not own this chat message.");
        }
        
        req.userChatMessage = userChatMessage;
        req.assistantChatMessage = assistantChatMessage;
        next();
    } catch (error) {
        next(error);
    }
};