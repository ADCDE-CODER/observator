import express from "express";

export default setupChatMessageRoutes = (chatMessageController, verifyToken) => {
    const router = express.Router();

    router.post("/create", verifyToken, chatMessageController.create);
    router.get("/read:id", chatMessageController.read);
    router.put("/update:id", verifyToken, chatMessageController.update);
    router.delete("/delete:id", chatMessageController.delete);
};