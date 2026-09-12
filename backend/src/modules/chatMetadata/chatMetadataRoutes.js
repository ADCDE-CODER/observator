import express from "express";
import { chatMetadataController } from "./chatMetadataContainer.js";
import { authenticate } from "../../middleware/userAuthentication.js";
import { verifyChatOwner } from "../../middleware/chatAuthorization.js";

const router = express.Router({
    mergeParams: true
});

router.get("/", authenticate, verifyChatOwner, (req, res) => chatMetadataController.getChatSettings(req, res));
router.put("/", authenticate, verifyChatOwner, (req, res) => chatMetadataController.update(req, res));

export default router;