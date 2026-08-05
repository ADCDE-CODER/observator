import { db } from "../../config/database.js";
import UserChatMessageModel from "./userChatMessage/UserChatMessageModel.js";
import AssistantChatMessageModel from "./assistantChatMessage/AssistantChatMessageModel.js";
import ChatMessageModel from "./ChatMessageModel.js";
import UserChatMessageService from "./userChatMessage/UserChatMessageService.js";
import AssistantChatMessageService from "./assistantChatMessage/AssistantChatMessageService.js";
import ChatMessageService from "./ChatMessageService.js";
import AIGenerationService from "./AIGenerationService.js";
import ChatMessageController from "./ChatMessageController.js";
import { chatMetadataService } from "../chatMetadata/chatMetadataContainer.js";

const chatMessageModel = new ChatMessageModel(db);
const userChatMessageModel = new UserChatMessageModel(db);
const assistantChatMessageModel = new AssistantChatMessageModel(db);
const userChatMessageService = new UserChatMessageService(userChatMessageModel);
const assistantChatMessageService = new AssistantChatMessageService(assistantChatMessageModel);
const aiGenerationService = new AIGenerationService(chatMetadataService);
const chatMessageService = new ChatMessageService(chatMessageModel, userChatMessageService, assistantChatMessageService, aiGenerationService);
const chatMessageController = new ChatMessageController(chatMessageService);

export { chatMessageController };