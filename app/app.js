import express from "express";
import cors from "cors";
import { userRouter } from "./routes/userRoutes.js";
import { chatRouter } from "./routes/chatRoutes.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/chat", chatRouter);

export { app };