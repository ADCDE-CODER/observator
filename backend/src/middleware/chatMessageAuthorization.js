import { db } from "../config/database.js";
import ChatMessageModel from "../modules/chatMessage/ChatMessageModel.js";
import ChatMessageService from "../modules/chatMessage/ChatMessageService.js";

export function verifyChatMessageOwner(req, res, next) {
    const chatId = req.chat.id;
    const chatMessageId = Number(req.params.chatMessageId);
    
    try {
        const chatMessageModel = new ChatMessageModel(db);
        const chatMessageService = new ChatMessageService(chatMessageModel);
        const chatMessage = chatMessageService.getById(chatMessageId, chatId);

        req.chatMessage = chatMessage;
        next();
    } catch (error) {
        next(error);
    }
};