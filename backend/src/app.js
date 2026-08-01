import express from "express";
import cors from "cors";
import userRouter from "./modules/user/userRoutes.js";
import chatRouter from "./modules/chat/chatRoutes.js";
import chatMetadataRouter from "./modules/chatMetadata/chatMetadataRoutes.js";
import chatMessageRouter from "./modules/chatMessage/chatMessageRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => res.send("Welcome to Observator server!"));
app.use("/users", userRouter);
app.use("/chats", chatRouter);
app.use("/chats/:chatId/chatMetadata", chatMetadataRouter);
app.use("/chats/:chatId/chatMessages", chatMessageRouter);

// Global error handler
app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.status || 500).json({message: error.message})
});

export default app;