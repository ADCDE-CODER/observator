import { db } from "../../config/database.js";
import ChatModel from "./ChatModel.js";
import ChatService from "./ChatService.js";
import ChatController from "./ChatController.js";
import { chatMetadataService } from "../chatMetadata/chatMetadataContainer.js";

const chatModel = new ChatModel(db);
const chatService = new ChatService(chatModel, chatMetadataService);
const chatController = new ChatController(chatService);

export { chatController };