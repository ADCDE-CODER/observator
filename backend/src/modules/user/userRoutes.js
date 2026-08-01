import express from "express";
import { userController } from "./userContainer.js";
import { authenticate } from "../../middleware/userAuthentication.js";

const router = express.Router();

router.post("/signup", (req, res) => userController.signup(req, res));
router.post("/signin", (req, res) => userController.signin(req, res));
router.get("/", authenticate, (req, res) => userController.getProfile(req, res));
router.put("/", authenticate, (req, res) => userController.updateProfile(req, res));
router.delete("/", authenticate, (req, res) => userController.deleteAccount(req, res));

export default router;