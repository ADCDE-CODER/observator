import { db } from "../config/database.js";
import ChatModel from "../modules/chat/ChatModel.js";

export function verifyChatOwner(req, res, next) {
    const userId = req.user.id;
    const chatId = Number(req.params.chatId);
    
    try {
        const chatModel = new ChatModel(db);
        const chat = chatModel.findById(chatId, userId);
        
        if (!chat) {
            throw new Error("Chat not found or user does not own this chat.");
        }
        
        req.chat = chat;
        next();
    } catch (error) {
        next(error);
    }
};