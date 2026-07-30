import express from "express";
import { chatMessageController } from "./chatMessageContainer.js";
import { verifyToken, verifyChatOwner, verifyChatMessageOwner } from "./../../middleware/auth.js";

const router = express.Router({
    mergeParams: true
});

router.post("/", verifyToken, verifyChatOwner, (req, res) => chatMessageController.create(req, res));
router.get("/", verifyToken, verifyChatOwner, (req, res) => chatMessageController.getAll(req, res));
router.put("/:chatMessageId", verifyToken, verifyChatOwner, verifyChatMessageOwner, (req, res) => chatMessageController.update(req, res));
router.delete("/:chatMessageId", verifyToken, verifyChatOwner, verifyChatMessageOwner, (req, res) => chatMessageController.delete(req, res));

export default router;