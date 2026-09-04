import { db } from "../../config/database.js";
import ChatMessageModel from "./ChatMessageModel.js";
import UserChatMessageModel from "./userChatMessage/UserChatMessageModel.js";
import AssistantChatMessageModel from "./assistantChatMessage/AssistantChatMessageModel.js";
import UserChatMessageService from "./userChatMessage/UserChatMessageService.js";
import AssistantChatMessageService from "./assistantChatMessage/AssistantChatMessageService.js";
import ChatMessageService from "./ChatMessageService.js";
import ChatMessageController from "./ChatMessageController.js";
import { chatMetadataService } from "../chatMetadata/chatMetadataContainer.js";
import { aiService } from "../ai/AIContainer.js"

const chatMessageModel = new ChatMessageModel(db);
const userChatMessageModel = new UserChatMessageModel(db);
const assistantChatMessageModel = new AssistantChatMessageModel(db);
const userChatMessageService = new UserChatMessageService(userChatMessageModel);
const assistantChatMessageService = new AssistantChatMessageService(assistantChatMessageModel);
const chatMessageService = new ChatMessageService(chatMessageModel, userChatMessageService, assistantChatMessageService, chatMetadataService, aiService);
const chatMessageController = new ChatMessageController(chatMessageService);

export { chatMessageController };