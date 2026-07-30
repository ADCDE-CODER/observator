import { db } from "../../config/database.js";
import UserChatMessageModel from "./UserChatMessageModel.js";
import AssistantChatMessageModel from "./AssistantChatMessageModel.js";
import UserChatMessageService from "./UserChatMessageService.js";
import AssistantChatMessageService from "./AssistantChatMessageService.js";
import ChatMessageService from "./ChatMessageService.js";
import AIGenerationService from "./AIGenerationService.js";
import ChatMessageController from "./ChatMessageController.js";
import { chatMetadataService } from "../chatMetadata/chatMetadataContainer.js";

const userChatMessageModel = new UserChatMessageModel(db);
const assistantChatMessageModel = new AssistantChatMessageModel(db);
const userChatMessageService = new UserChatMessageService(userChatMessageModel);
const assistantChatMessageService = new AssistantChatMessageService(assistantChatMessageModel);
const aiGenerationService = new AIGenerationService(chatMetadataService);
const chatMessageService = new ChatMessageService(userChatMessageService, assistantChatMessageService, aiGenerationService);
const chatMessageController = new ChatMessageController(chatMessageService);

export { chatMessageController };