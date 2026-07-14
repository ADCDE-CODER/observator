import express from "express";
import cors from "cors";
import { userRouter } from "./routes/userRoutes.js";
import { chatRouter } from "./routes/chatRoutes.js"
import { messageRouter } from "./routes/messageRoutes.js";

const app = express();

const userRouter = setupUserRoutes();
const chatRouter = setupChatRoutes():
const chatMessageRouter = setupChatMessageRoutes();

app.use(cors());
app.use(express.json());
app.use("/users", userRouter);
app.use("/chats", chatRouter);
app.use("/chatmessages", chatMessageRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server started at port " + "http://localhost:", PORT);
    console.log("System Ready: All service dependencies initialized.");
});