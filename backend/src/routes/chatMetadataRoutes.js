import express from "express";

export default setupChatMetadataRoutes = (chatMetadataController) => {
    const router = express.Router();

    router.post("/create", chatMetadataController.create);
    router.get("/read:id", chatMetadataController.read);
    router.put("/update:id", chatMetadataController.update);
};