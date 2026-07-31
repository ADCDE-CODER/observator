import express from "express";
import { chatMetadataController } from "./chatMetadataContainer.js";
import { verifyToken, verifyChatOwner } from "../../middleware/auth.js";

const router = express.Router({
    mergeParams: true
});

router.get("/", verifyToken, verifyChatOwner, (req, res) => chatMetadataController.getById(req, res));
router.put("/", verifyToken, verifyChatOwner, (req, res) => chatMetadataController.update(req, res));

export default router;