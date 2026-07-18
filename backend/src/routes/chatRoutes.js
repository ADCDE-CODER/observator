import express from "express";

const setupChatRoutes = (chatController) => {
    const router = express.Router();

    router.post("/create", chatController.create);
    router.get("/read:id", chatController.read);
    router.put("/update:id", chatController.update);
    router.delete("/delete:id", chatController.delete);

    return router;
};

export default setupChatRoutes;