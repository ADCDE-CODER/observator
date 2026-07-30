import { db } from "../../config/database.js";
import ChatModel from "./ChatModel.js";
import ChatService from "./ChatService.js";
import ChatController from "./ChatController.js";

const chatModel = new ChatModel(db);
const chatService = new ChatService(chatModel);
const chatController = new ChatController(chatService);

export { chatController };