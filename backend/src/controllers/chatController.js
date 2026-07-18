export default class ChatController {
    constructor(ChatServiceInstance) {
        this.ChatService = ChatServiceInstance;
    }

    create(req, res) {
        const { title, user_id } = req.body;
        let chats;

        try {
            chats = this.ChatService.read(user_id);
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message});
        }

        if(!title) {
            let chatIndex = chats.length + 1;
            title = "New Chat " + chatIndex;
        }

        try {
            this.ChatService.create({title, user_id});
            chats = this.ChatService.read(user_id); // List of chats is uppdated
            const lastChatItem = chats[chats.length - 1];
            const chat = {lastChatItem};

            res.status(201).json({message: "Chat created successfully", chat});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message});
        }
    };
    
    read(req, res) {
        const { user_id } = req.body;
        
        try {
            const chats = this.ChatService.read(user_id);
            res.status(200).json({message: "Chat read successfully", chats}); 
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    update(req, res) {
        const { title, id, user_id } = req.body;
        
        try {
            const chat = this.ChatService.update({ title, id, user_id });
            res.status(200).json({message: "Chat updated successfully", chat});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    delete(req, res) {
        const { id, user_id } = req.body;
        
        try {
            this.ChatService.delete(id, user_id);
            res.status(200).json({message: "Chat deleted successfully"});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };
}