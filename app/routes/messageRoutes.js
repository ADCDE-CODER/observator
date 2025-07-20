import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { createChatMessagePost, readAllChatMessagesGet } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/prompt", authenticateToken, createChatMessagePost);

messageRouter.get("/all", readAllChatMessagesGet);

export { messageRouter };