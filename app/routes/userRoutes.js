import express from "express";
import { signUpUserPost, signUpUsersGet, signInUserPost } from "../controllers/userController.js"

const userRouter = express.Router();

userRouter.post("/signup", signUpUserPost);

userRouter.get("/signup", signUpUsersGet);

userRouter.post("/signin", signInUserPost);

export { userRouter };