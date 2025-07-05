import express from "express";
import { createUserPost, readUsersGet, readUserPost } from "../controllers/userController.js"

const userRouter = express.Router();

userRouter.post("/create", createUserPost);

userRouter.get("/read", readUsersGet);

userRouter.post("/auth", readUserPost);

export { userRouter };