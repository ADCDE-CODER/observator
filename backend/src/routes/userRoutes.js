import express from "express";

export default setupUserRoutes = (userController) => {
    const router = express.Router();

    router.post("/create", userController.create);
    router.get("/read:id", userController.read);
    router.put("/update:id", userController.update);
    router.delete("/delete:id", userController.delete);
};