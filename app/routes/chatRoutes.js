import express from "express";
import { createChatPost, readAllChatsGet, readChatPost } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/new", createChatPost);

chatRouter.get("/all", readAllChatsGet);

chatRouter.post("/one", readChatPost);

export { chatRouter };