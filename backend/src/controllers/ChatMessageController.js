export default class ChatMessageController {
    constructor(chatMessageService, chatMetadataService, aiGenerationService) {
        this.chatMessageService = chatMessageService;
        this.chatMetadataService = chatMetadataService;
        this.aiGenerationService = aiGenerationService;
    }

    async create(req, res) {
        const userChatMessage = req.body;
        const chatId = req.chat.id;

        // Initialize the property as an empty string prevent undefined
        let assistantChatMessage = {
            thinking: "",
            content: ""
        };
        
        // Get streaming from AI
        try {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            try {
                const conversationContext = this.chatMessageService.getChatMessages(chatId);
                conversationContext.push({role: userChatMessage.role, content: userChatMessage.content, images: userChatMessage.images});
                const chatMetadata = this.chatMetadataService.getById(chatId);
                const generator = await this.aiGenerationService.generateResponse(conversationContext, chatMetadata);

                for await (const event of generator) {
                    if (event.type === "thinking") {
                        res.write(`data: ${JSON.stringify(event)}\n\n`);
                        assistantChatMessage.thinking += event.text;
                    } else if (event.type === "content") {
                        res.write(`data: ${JSON.stringify(event)}\n\n`);
                        assistantChatMessage.content += event.text;
                    }

                    if (event.done) {
                        assistantChatMessage.role = event.role;
                        assistantChatMessage.model = event.model;
                        assistantChatMessage.createdAt = event.createdAt;
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
        } finally {
            console.log("Attempting to save data...");
            
            try {
                this.chatMessageService.create(userChatMessage, assistantChatMessage, chatId);
                console.log("User and assistant message saved successfully.");
            } catch (error) {
                console.error(error);
                res.status(error.status || 500).json({message: error.message});
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