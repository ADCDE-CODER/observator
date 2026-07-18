export class ChatMessageController {
    constructor(ChatMessageServiceInstance, chatMetadataServiceInstance, AIGenerationServiceInstance) {
        this.ChatMessageService = ChatMessageServiceInstance;
        this.chatMetadataService = chatMetadataServiceInstance;
        this.AIGenerationService = AIGenerationServiceInstance;
    }

    create(req, res) {
        const { content, images, chat_id } = req.body;
        const userRole = "user";
        const assistantRole = "assistant";

        // Reads chat history and builds the context array.
        let chatMessages = [];
        let chatMetadata = [];
        let conversationContext = [];
        let fullAssistantMessageContent = "";

        try {
            chatMessages = this.ChatMessageService.read(chat_id);
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }

        try {
            // Load all chat messages from database and store all in conversation contexts 
            if (chatMessages && chatMessages.length > 0) {
                messages.forEach(message => {
                    if(typeof message.images !== null) {
                        conversationContext.push({ role: message.role, content: message.content, images: message.images });
                    } else {
                        conversationContext.push({ role: message.role, content: message.content });
                    }
                });
            }

            // Store new user content in conversation context
            if(typeof content === null) {
                const error = new Error("Context is required");
                error.status = 400;
                throw error;
            }
            
            if(typeof images !== null) {
                conversationContext.push({role: userRole, content: content, images: images});
            } else {
                conversationContext.push({role: userRole, content: content});
            }
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message});
        }

        // Get chat metadata
        try {
            chatMetadata = this.chatMetadataService.read(chat_id);
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message});
        }

        // Streaming phase
        try {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            let stream;

            try {
                stream = await this.AIGenerationService.streamResponse(conversationContext, chatMetadata);
            } catch (error) {
                console.error(error);
                res.status(error.status || 500).json({message: error.message});
            }

            // Stream the content chunk by chunk
            for await (const chunk of stream) {
                if (!chunk || !chunk.message || !chunk.message.content) {
                    continue;
                }

                fullAssistantMessageContent += chunk.message.content;
                const dataToSend = { chunk: chunk.message.content };
                res.write(`data: ${JSON.stringify(dataToSend)}\r\n\r\n`); 
            }
            
            // End response when streaming is complete. 
            res.end();
        } catch (error) {
            console.error(error);
            
            if (!res.headersSent) {                 
                res.status(error.status || 500).json({message: error.message})
            }
        } finally {
            console.log("Attempting to save data...");
            
            try {
                this.ChatMessageService.create({ userRole, content, images, chat_id });
                this.ChatMessageService.create({ assistantRole, fullAssistantMessageContent, chat_id });
                
                console.log("User and assistant message saved successfully.");
            } catch (error) {
                console.error(error);
                res.status(error.status || 500).json({message: error.message});
            }
        }
    };
    
    read(req, res) {
        const { chat_id } = req.body;
        
        try {
            const chatMessages = this.ChatMessageService.read(chat_id);
            res.status(200).json({message: "Chat message read successfully", chatMessages}); 
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    update(req, res) {
        const { role, content, images, id, chat_id } = req.body;
        
        try {
            const chatMessage = this.ChatMessageService.update({ role, content, images, id, chat_id });
            res.status(200).json({message: "Chat message updated successfully", chatMessage});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    delete(req, res) {
        const { id, chat_id } = req.body;
        
        try {
            this.ChatMessageService.delete(id, chat_id);
            res.status(200).json({message: "Chat message deleted successfully"});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };
}