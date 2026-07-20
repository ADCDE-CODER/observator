import express from "express";
import { verifyToken } from "./../middleware/auth.js";

const setupChatRoutes = (chatController) => {
    const router = express.Router();

    router.post("/", verifyToken, (req, res) => chatController.create(req, res));
    router.get("/", verifyToken, (req, res) => chatController.read(req, res));
    router.put("/", verifyToken, (req, res) => chatController.update(req, res));
    router.delete("/", verifyToken, (req, res) => chatController.delete(req, res));

    return router;
};

export default setupChatRoutes;