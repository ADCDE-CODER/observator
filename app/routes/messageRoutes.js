import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { createChatMessagePost, readAllChatMessagesGet } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/prompt", authenticateToken, createChatMessagePost);

chatRouter.get("/message", readAllChatMessagesGet);

export { chatRouter };