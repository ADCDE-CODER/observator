import express from "express";
import { chatController } from "./chatContainer.js";
import { verifyToken, verifyChatOwner } from "../../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, (req, res) => chatController.create(req, res));
router.get("/", verifyToken, (req, res) => chatController.getAll(req, res));
router.put("/:chatId", verifyToken, verifyChatOwner, (req, res) => chatController.update(req, res));
router.delete("/:chatId", verifyToken, verifyChatOwner, (req, res) => chatController.delete(req, res));

export default router;