export default class ChatMessageController {
    constructor(chatMessageService) {
        this.chatMessageService = chatMessageService;
    }

    async create(req, res) {
        const userChatMessage = req.body;
        const chatId = req.chat.id;

        // Get streaming from AI
        try {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            try {
                const generator = this.chatMessageService.generateResponse(userChatMessage, chatId);
                
                for await (const event of generator) {
                    if (event.thinking) {
                        res.write(`data: ${JSON.stringify(event)}\n\n`);
                    } else if (event.content) {
                        res.write(`data: ${JSON.stringify(event)}\n\n`);
                    }

                    if (event.done) {
                        res.write(`data: ${JSON.stringify(event)}\n\n`);
                    }
                }
                
                // End response when streaming is complete. 
                res.end();
            } catch (error) {
                console.error(error);
                res.status(error.status || 500).json({message: error.message});
            }
        } catch (error) {
            console.error(error);
            
            if (!res.headersSent) {                 
                res.status(error.status || 500).json({message: error.message})
            }
        }
    };
    
    getAll(req, res) {
        const chatId = req.chat.id;

        try {            
            const chatMessages = this.chatMessageService.getChatMessages(chatId);
            res.status(200).json({message: "Chat message read successfully", chatMessages});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        } 
    };

    update(req, res) {
        const chatMessageData = req.body;
        const chatId = req.chat.id;
        const userChatMessageId = req.userChatMessage.id;
        const assistantChatMessageId = req.assistantChatMessage.id;
        
        try {
            const chatMessage = this.chatMessageService.update(chatMessageData, userChatMessageId, assistantChatMessageId, chatId)
            res.status(200).json({message: "Chat message updated successfully", chatMessage});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    delete(req, res) {
        const chatId = req.chat.id;
        const userChatMessageId = req.userChatMessage.id;
        const assistantChatMessageId = req.assistantChatMessage.id;
        
        try {
            this.chatMessageService.delete(userChatMessageId, assistantChatMessageId, chatId);
            res.status(200).json({message: "Chat message deleted successfully"});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };
}