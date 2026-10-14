import express from "express";
import { chatMetadataController } from "./chatMetadataContainer.js";
import { authenticate } from "../../middleware/userAuthentication.js";
import { verifyChatOwner } from "../../middleware/chatAuthorization.js";

const router = express.Router({
    mergeParams: true
});

router.get("/", authenticate, verifyChatOwner, (req, res) => chatMetadataController.getChatMetadata(req, res));
router.put("/provider", authenticate, verifyChatOwner, (req, res) => chatMetadataController.updateProvider(req, res));
router.put("/providerConfig", authenticate, verifyChatOwner, (req, res) => chatMetadataController.updateProviderConfig(req, res));
router.put("/model", authenticate, verifyChatOwner, (req, res) => chatMetadataController.updateModel(req, res));
router.put("/config", authenticate, verifyChatOwner, (req, res) => chatMetadataController.updateConfig(req, res));
router.get("/resetProvider", authenticate, verifyChatOwner, (req, res) => chatMetadataController.resetProvider(req, res));
router.get("/resetProviderConfig", authenticate, verifyChatOwner, (req, res) => chatMetadataController.resetProviderConfig(req, res));
router.get("/resetModel", authenticate, verifyChatOwner, (req, res) => chatMetadataController.resetModel(req, res));
router.get("/resetConfig", authenticate, verifyChatOwner, (req, res) => chatMetadataController.resetConfig(req, res));

export default router;