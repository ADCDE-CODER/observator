import express from "express";
import { verifyToken } from "./../middleware/auth.js";

const setupChatMetadataRoutes = (chatMetadataController) => {
    const router = express.Router();

    router.post("/", verifyToken, (req, res) => chatMetadataController.create(req, res));
    router.get("/", verifyToken, (req, res) => chatMetadataController.read(req, res));
    router.put("/", verifyToken, (req, res) => chatMetadataController.update(req, res));

    return router;
};

export default setupChatMetadataRoutes;