import express from "express";
import cors from "cors";
import { userRouter } from "./routes/userRoutes.js";
import { chatRouter } from "./routes/chatRoutes.js"
import { messageRouter } from "./routes/messageRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server started at port " + "http://localhost:", PORT);
    console.log("System Ready: All service dependencies initialized.");
});