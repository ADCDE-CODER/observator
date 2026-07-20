import express from "express";
import { verifyToken } from "./../middleware/auth.js";

const setupChatMessageRoutes = (chatMessageController) => {
    const router = express.Router();

    router.post("/", verifyToken, (req, res) => chatMessageController.create(req, res));
    router.get("/", verifyToken, (req, res) => chatMessageController.read(req, res));
    router.put("/", verifyToken, (req, res) => chatMessageController.update(req, res));
    router.delete("/", verifyToken, (req, res) => chatMessageController.delete(req, res));

    return router;
};

export default setupChatMessageRoutes;