import express from "express";
import { verifyChatOwner, verifyToken, verifyChatMessageOwner } from "./../middleware/auth.js";

const setupChatRoutes = (chatController, chatMetadataController, chatMessageController) => {
    const router = express.Router();

    // Chat
    router.post("/", verifyToken, (req, res) => chatController.create(req, res));
    router.get("/", verifyToken, (req, res) => chatController.getAll(req, res));
    router.put("/:chatId", verifyToken, verifyChatOwner, (req, res) => chatController.update(req, res));
    router.delete("/:chatId", verifyToken, verifyChatOwner, (req, res) => chatController.delete(req, res));

    // Chat metadata
    router.get("/:chatId/chatMetadata", verifyToken, verifyChatOwner, (req, res) => chatMetadataController.getById(req, res));
    router.put("/:chatId/chatMetadata", verifyToken, verifyChatOwner, (req, res) => chatMetadataController.update(req, res));

    // Chat message
    router.post("/:chatId/chatMessage", verifyToken, verifyChatOwner, (req, res) => chatMessageController.create(req, res));
    router.get("/:chatId/chatMessages", verifyToken, verifyChatOwner, (req, res) => chatMessageController.getAll(req, res));
    router.put("/:chatId/chatMessages/:chatMessageId", verifyToken, verifyChatOwner, verifyChatMessageOwner, (req, res) => chatMessageController.update(req, res));
    router.delete("/:chatId/chatMessages/:chatMessageId", verifyToken, verifyChatOwner, verifyChatMessageOwner, (req, res) => chatMessageController.delete(req, res));

    return router;
};

export default setupChatRoutes;