import { db } from "../config/database.js";
import ChatModel from "../modules/chat/ChatModel.js";
import ChatService from "../modules/chat/ChatService.js";

export function verifyChatOwner(req, res, next) {
    const userId = req.user.id;
    const chatId = Number(req.params.chatId);
    
    try {
        const chatModel = new ChatModel(db);
        const chatService = new ChatService(chatModel);
        const chat = chatService.getById(chatId, userId);
        
        req.chat = chat;
        next();
    } catch (error) {
        next(error);
    }
};