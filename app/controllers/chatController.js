import { createChat, readAllChats, readChat, updateChat, deleteChat } from "../models/chatModel.js";

const createChatPost = (req, res) => {
    const { user } = req.body.data;

    if (user) {
        try {
            let chats = readChat(user.id);

            if (chats) {
                let chatIndex = chats.length + 1;

                try {
                    const chatCreated = createChat(user.id, "New Chat " + chatIndex);
                    chats = readChat(user.id); // List of chats is uppdated
                    const lastChatItem = chats[chats.length - 1];

                    res.status(201).json({success: true, lastChatItem: lastChatItem, message: "Your chat is successfully created!"});
                } catch (error) {
                    const errorMessage = `Failed to create a new chat: ${error.message}`;
                    console.error(errorMessage);
                    res.status(500).json({success: false, error: errorMessage});
                }
      
            } else {
                res.status(400).json({success: false, error: "No chat found"});
            }
  
        } catch (error) {
            const errorMessage = `Failed to read chat: ${error.message}`;
            console.error(errorMessage);
            res.status(500).json({success: false, error: errorMessage});
        }
    } else {
        res.status(400).json({success: false, error: "No user found"});
    }
};

const readAllChatsGet = (req, res) => {
    try {
        const chats = readAllChats();

        if (chats) {
            res.status(200).json({success: true, chats: chats, message: "Successful to get all chats"});
        } else {
            res.status(400).json({success: false, error: "Could not find all chats"});
        }
    } catch (error) {
        const errorMessage = `Failed to read all chats: ${error.message}`;
        console.error(errorMessage);
        res.status(500).json({ success: false, error: errorMessage});
    }
};

const readChatPost = (req, res) => {
    const { user } = req.body.data;

    if (user) {
        try {
            const chats = readChat(user.id);

            if (chats) {
                res.status(200).json({success: true, chats: chats, message: "Successful to get chat"});
            } else {
                res.status(400).json({success: false, error: "Could not find all chats"});
            }

        } catch (error) {
            const errorMessage = `Failed to read chat: ${error.message}`;
            console.error(errorMessage);
            res.status(500).json({success: false, error: errorMessage});
        }
    } else {
        res.status(400).json({success: false, error: "No user found"});
    }
};

const updateChatPost = (req, res) => {
    const { user, chatId, title } = req.body.data;

    if (user) {
        try {
            const chat = updateChat(title, user.id, chatId);

            if (chat.changes != 0 || chat.lastInsertRowid != 0) {
                res.status(200).json({success: true, updateChat: chat, message: "Successful to update chat"});
            } else {
                res.status(400).json({success: false, error: "Could not update chat"});
            }

        } catch (error) {
            const errorMessage = `Failed to update chat: ${error.message}`;
            console.error(errorMessage);
            res.status(500).json({success: false, error: errorMessage});
        }
    } else {
        res.status(400).json({success: false, error: "No user found"});
    }
};

const deleteChatPost = (req, res) => {
    const { user, chatId } = req.body.data;

    if (user) {
        try {
            const chat = deleteChat(user.id, chatId);

            if (chat.changes != 0 || chat.lastInsertRowid != 0) {
                res.status(200).json({success: true, deleteChat: chat, message: "Successful to delete chat"});
            } else {
                res.status(400).json({success: false, error: "Could not delete chat"});
            }

        } catch (error) {
            const errorMessage = `Failed to delete chat: ${error.message}`;
            console.error(errorMessage);
            res.status(500).json({success: false, error: errorMessage});
        }
    } else {
        res.status(400).json({success: false, error: "No user found"});
    }
};

export { createChatPost, readAllChatsGet, readChatPost, updateChatPost, deleteChatPost };