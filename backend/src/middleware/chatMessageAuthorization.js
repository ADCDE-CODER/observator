import { db } from "../config/database.js";
import ChatMessageModel from "../modules/chatMessage/ChatMessageModel.js";

export function verifyChatMessageOwner(req, res, next) {
    const chatId = req.chat.id;
    const chatMessageId = Number(req.params.chatMessageId);
    
    try {
        const chatMessageModel = new ChatMessageModel(db);
        const chatMessage = chatMessageModel.findById(chatMessageId, chatId);

        if (!chatMessage) {
            throw new Error("Chat message not found or user does not own this chat message.");
        }
        
        req.chatMessage = chatMessage;
        next();
    } catch (error) {
        next(error);
    }
};