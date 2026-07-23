export default class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }

    create(req, res) {
        let chatData = req.body;
        const userId = req.user.id;
        let chats;

        try {
            chats = this.chatService.getAll(userId);
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message});
        }

        if(!chatData.title) {
            let chatIndex = chats.length + 1;
            chatData.title = "New Chat " + chatIndex;
        }

        try {
            this.chatService.create(chatData, userId);
            chats = this.chatService.getAll(userId); // List of chats is uppdated
            const lastChatItem = chats[chats.length - 1];
            const chat = {lastChatItem};

            res.status(201).json({message: "Chat created successfully", chat});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message});
        }
    };
    
    getAll(req, res) {
        const userId = req.user.id;
        
        try {
            const chats = this.chatService.getAll(userId);
            res.status(200).json({message: "Chat read successfully", chats}); 
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    update(req, res) {
        const chatData = req.body;
        const userId = req.user.id;
        const chatId = req.chat.id;
        
        try {
            const chat = this.chatService.update(chatData, chatId, userId);
            res.status(200).json({message: "Chat updated successfully", chat});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    delete(req, res) {
        const userId = req.user.id;
        const chatId = req.chat.id;
        
        try {
            this.chatService.delete(chatId, userId);
            res.status(200).json({message: "Chat deleted successfully"});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };
}