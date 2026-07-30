import express from "express";
import { verifyToken } from "./../middleware/auth.js";

const setupUserRoutes = (userController) => {
    const router = express.Router();

    router.post("/signup", (req, res) => userController.signup(req, res));
    router.post("/signin", (req, res) => userController.signin(req, res));
    router.get("/", verifyToken, (req, res) => userController.getProfile(req, res));
    router.put("/", verifyToken, (req, res) => userController.updateProfile(req, res));
    router.delete("/", verifyToken, (req, res) => userController.deleteAccount(req, res));

    return router;
};

export default setupUserRoutes;