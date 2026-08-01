import express from "express";
import { chatMessageController } from "./chatMessageContainer.js";
import { authenticate } from "../../middleware/userAuthentication.js";
import { verifyChatOwner } from "../../middleware/chatAuthorization.js";
import { verifyChatMessageOwner } from "../../middleware/chatMessageAuthorization.js";

const router = express.Router({
    mergeParams: true
});

router.post("/", authenticate, verifyChatOwner, (req, res) => chatMessageController.create(req, res));
router.get("/", authenticate, verifyChatOwner, (req, res) => chatMessageController.getAll(req, res));
router.put("/:chatMessageId", authenticate, verifyChatOwner, verifyChatMessageOwner, (req, res) => chatMessageController.update(req, res));
router.delete("/:chatMessageId", authenticate, verifyChatOwner, verifyChatMessageOwner, (req, res) => chatMessageController.delete(req, res));

export default router;