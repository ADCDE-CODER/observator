import jwt from "jsonwebtoken";
import { db } from "../config/database.js"; 
import ChatModel from "../modules/chat/ChatModel.js";
import UserChatMessageModel from "../modules/chatMessage/UserChatMessageModel.js";
import AssistantChatMessageModel from "../modules/chatMessage/AssistantChatMessageModel.js";

export const generateToken = (userData) => {
    const { id } = userData; 
    
    if (!id) {
        const error = new Error("ID is required to generate a token.");
        error.status = 400;
        throw error;
    }

    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET);
};

export function verifyToken(req, res, next) {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(" ")[1];
    
    if (!token) {
        const error = new Error("Access denied: No token");
        error.status = 403;
        throw error;
    }

    try {
        const decodedUserFromToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decodedUserFromToken;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({message: "Invalid or expired token"});
    }  
};

export function verifyChatOwner(req, res, next) {
    const userId = req.user.id;
    const chatId = Number(req.params.chatId);
    
    try {
        const chatModel = new ChatModel(db);
        const chat = chatModel.findById(chatId, userId);

        if (!chat) {
            throw new Error("Chat not found.");
        }

        req.chat = chat;
        next();
    } catch (error) {
        next(error);
    }
};

export function verifyChatMessageOwner(req, res, next) {
    const chatId = req.chat.id;
    const chatMessageId = Number(req.params.chatMessageId);
    
    try {
        const userChatMessageModel = new UserChatMessageModel(db);
        const assistantChatMessageModel = new AssistantChatMessageModel(db);
        const userChatMessage = userChatMessageModel.findById(chatMessageId, chatId);
        const assistantChatMessage = assistantChatMessageModel.findById(chatMessageId, chatId);

        if (!userChatMessage || !assistantChatMessage) {
            throw new Error("Chat message not found.");
        }
        
        req.userChatMessage = userChatMessage;
        req.assistantChatMessage = assistantChatMessage;
        next();
    } catch (error) {
        next(error);
    }
};