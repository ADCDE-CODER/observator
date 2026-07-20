import express from "express";
import { verifyToken } from "./../middleware/auth.js";

const setupUserRoutes = (userController) => {
    const router = express.Router();

    router.post("/create", (req, res) => userController.create(req, res));
    router.post("/read", (req, res) => userController.read(req, res));
    router.get("/me", verifyToken, (req, res) => userController.get(req, res));
    router.put("/me", verifyToken, (req, res) => userController.update(req, res));
    router.delete("/me", verifyToken, (req, res) => userController.delete(req, res));

    return router;
};

export default setupUserRoutes;