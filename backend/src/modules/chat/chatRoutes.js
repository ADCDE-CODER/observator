import express from "express";
import { chatController } from "./chatContainer.js";
import { authenticate } from "../../middleware/userAuthentication.js";
import { verifyChatOwner } from "../../middleware/chatAuthorization.js";

const router = express.Router();

router.post("/", authenticate, (req, res) => chatController.create(req, res));
router.get("/", authenticate, (req, res) => chatController.getAll(req, res));
router.put("/:chatId", authenticate, verifyChatOwner, (req, res) => chatController.update(req, res));
router.delete("/:chatId", authenticate, verifyChatOwner, (req, res) => chatController.delete(req, res));

export default router;