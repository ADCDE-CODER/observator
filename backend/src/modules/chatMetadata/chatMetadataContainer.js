import { db } from "../../config/database.js";
import ChatMetadataModel from "./ChatMetadataModel.js";
import ChatMetadataService from "./ChatMetadataService.js";
import ChatMetadataController from "./ChatMetadataController.js";
import { aiService } from "../ai/AIContainer.js";

const chatMetadataModel = new ChatMetadataModel(db);
const chatMetadataService = new ChatMetadataService(chatMetadataModel, aiService);
const chatMetadataController = new ChatMetadataController(chatMetadataService);

export { chatMetadataController, chatMetadataService };