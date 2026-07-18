import express from "express";
import { verifyToken } from "./../middleware/auth.js";

const setupChatMessageRoutes = (chatMessageController) => {
    const router = express.Router();

    router.post("/create", verifyToken, chatMessageController.create);
    router.get("/read:id", chatMessageController.read);
    router.put("/update:id", verifyToken, chatMessageController.update);
    router.delete("/delete:id", chatMessageController.delete);

    return router;
};

export default setupChatMessageRoutes;