import express from "express";
import { createUserPost, readUserGet } from "../controllers/userController.js"

const userRouter = express.Router();

userRouter.post("/create", createUserPost);

userRouter.get("/read", readUserGet);

export { userRouter };