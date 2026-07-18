import express from "express";

export default setupChatRoutes = (chatController) => {
    const router = express.Router();

    router.post("/create", chatController.create);
    router.get("/read:id", chatController.read);
    router.put("/update:id", chatController.update);
    router.delete("/delete:id", chatController.delete);
};