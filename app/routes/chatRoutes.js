import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { generateChatPost } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/prompt", authenticateToken, generateChatPost);

export { chatRouter };