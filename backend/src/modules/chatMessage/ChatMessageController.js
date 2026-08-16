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
                const conversationContext = this.chatMessageService.getChatMessages("ASC", chatId);
                conversationContext.push({role: userChatMessage.role, content: userChatMessage.content, images: userChatMessage.images});

                const assistantChatMessage = await this.chatMessageService.generateResponse(conversationContext, chatId, (event) => {
                    if (event.thinking) {
                        res.write(`data: ${JSON.stringify(event)}\n\n`);
                    } else if (event.content) {
                        res.write(`data: ${JSON.stringify(event)}\n\n`);
                    }

                    if (event.done) {
                        res.write(`data: ${JSON.stringify(event)}\n\n`); 
                    }
                });
                
                // End response when streaming is complete. 
                res.end();

                // Create the user and assistant messages in database.
                this.chatMessageService.create(userChatMessage, assistantChatMessage, chatId);
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
    }
    
    getAll(req, res) {
        const chatId = req.chat.id;

        try {            
            const chatMessages = this.chatMessageService.getChatMessages("ASC", chatId);
            res.status(200).json({message: "Chat message read successfully", chatMessages});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        } 
    }

    async update(req, res) {
        const userChatMessage = req.body;
        const chatId = req.chat.id;
        const chatMessageId = req.chatMessage.id;

        // Get streaming from AI
        try {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            try {
                const conversationContext = this.chatMessageService.updateUserMessage(userChatMessage, chatMessageId, chatId);
                const assistantChatMessage = await this.chatMessageService.generateResponse(conversationContext, chatId, (event) => {
                    if (event.thinking) {
                        res.write(`data: ${JSON.stringify(event)}\n\n`);
                    } else if (event.content) {
                        res.write(`data: ${JSON.stringify(event)}\n\n`);
                    }

                    if (event.done) {
                        res.write(`data: ${JSON.stringify(event)}\n\n`); 
                    }
                });
                
                // End response when streaming is complete. 
                res.end();

                this.chatMessageService.updateAssistantMessage(assistantChatMessage, chatMessageId, chatId);
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
    }

    delete(req, res) {
        const chatId = req.chat.id;
        const chatMessageId = req.chatMessage.id;
        
        try {
            this.chatMessageService.delete(chatMessageId, chatId);
            res.status(200).json({message: "Chat message deleted successfully"});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    }
}