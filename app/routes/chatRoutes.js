import express from "express";
import { createChatPost, readAllChatsGet, readChatPost, updateChatPost, deleteChatPost } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/new", createChatPost);

chatRouter.get("/all", readAllChatsGet);

chatRouter.post("/one", readChatPost);

chatRouter.post("/update", updateChatPost);

chatRouter.post("/delete", deleteChatPost);

export { chatRouter };