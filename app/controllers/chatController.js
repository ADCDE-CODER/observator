import { createChat, readAllChats, readChat, updateChat, deleteChat } from "../models/chatsModel.js";

const createChatPost = (req, res) => {
    const { user } = req.body;

    try {
        const chats = readChat(user.id);
        const lastChatItem = chats[chats.length - 1];
        const newChat = createChat(user.id, "New Chat " + (chats.length + 1) );

        res.status(200).json({ success: true, lastChatItem });
    } catch (error) {
        console.error("Failed to create new chat:", error.message);
        res.status(500).json({ success: false, error: error.message});
    }
};

const readAllChatsGet = (req, res) => {
    try {
        const allChats = readAllChats();
        res.status(200).json({ success: true, allChats });
    } catch (error) {
        console.error("Failed to read all chats:", error.message);
        res.status(500).json({ success: false, error: error.message});
    }
};

const readChatPost = (req, res) => {
    const { user } = req.body;
    
    try {
        const chats = readChat(user.id);
        res.status(200).json({ success: true, chats });
    } catch (error) {
        console.error("Failed to read chat:", error.message);
        res.status(500).json({ success: false, error: error.message});
    }
};

export { createChatPost, readAllChatsGet, readChatPost };