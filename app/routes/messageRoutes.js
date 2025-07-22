import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { createChatMessagePost, readAllChatMessagesGet, readChatMessagePost } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/prompt", verifyToken, createChatMessagePost);

messageRouter.get("/all", readAllChatMessagesGet);

messageRouter.post("/one", readChatMessagePost);


export { messageRouter };